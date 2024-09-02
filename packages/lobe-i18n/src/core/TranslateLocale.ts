import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { alert } from '@lobehub/cli-ui';
import path from 'node:path';

import { promptJsonTranslate, promptStringTranslate } from '@/prompts/translate';
import { LocaleObj } from '@/types';
import { I18nConfig } from '@/types/config';

export class TranslateLocale {
  private model: ChatOpenAI;
  private config: I18nConfig;
  private isJsonMode: boolean;
  promptJson: ChatPromptTemplate<{ from: string; json: string; to: string; translateMap: string }>;
  promptString: ChatPromptTemplate<{
    from: string;
    fromPath: string;
    text: string;
    to: string;
    toPath: string;
    translateMap: string;
  }>;
  constructor(config: I18nConfig, openAIApiKey: string, openAIProxyUrl?: string) {
    this.config = config;
    this.model = new ChatOpenAI({
      configuration: {
        baseURL: openAIProxyUrl,
      },
      maxConcurrency: config.concurrency,
      maxRetries: 4,
      modelName: config.modelName,
      openAIApiKey,
      temperature: config.temperature,
      topP: config.topP,
    });
    this.promptJson = promptJsonTranslate(config.reference);
    this.promptString = promptStringTranslate(config.reference);
    this.isJsonMode = Boolean(this.config?.experimental?.jsonMode);
  }

  getTranslateMap(to: string) {
    return Object.entries(this.config.translateMap?.[to] ?? {})
      .map((i) => i.join('|'))
      .join('\n');
  }
  async runByString({
    from,
    to,
    text,
    fromPath,
    toPath,
  }: {
    from?: string;
    fromPath: string;
    text: string;
    to: string;
    toPath: string;
  }): Promise<string | any> {
    try {
      const translateMap = this.getTranslateMap(to);
      const formattedChatPrompt = await this.promptString.formatMessages({
        from: from || this.config.entryLocale,
        fromPath,
        text: text,
        to,
        toPath: path.relative(process.cwd(), toPath),
        translateMap,
      });
      // console.log(formattedChatPrompt);
      const res = await this.model.call(formattedChatPrompt);

      const result = res['text'];

      if (!result) this.handleError();
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }
  async runByJson({
    from,
    to,
    json,
  }: {
    from?: string;
    json: LocaleObj;
    to: string;
  }): Promise<LocaleObj | any> {
    try {
      const formattedChatPrompt = await this.promptJson.formatMessages({
        from: from || this.config.entryLocale,
        json: JSON.stringify(json),
        to,
        translateMap: this.getTranslateMap(to),
      });

      const res = await this.model.invoke(
        formattedChatPrompt,
        this.isJsonMode
          ? {
              response_format: { type: 'json_object' },
            }
          : undefined,
      );

      const result = this.isJsonMode ? res['content'] : res['text'];

      if (!result) this.handleError();

      const message = JSON.parse(result as string);

      return message;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error?: any) {
    alert.error(`Translate failed, ${error || 'please check your network or try again...'}`, true);
  }
}
