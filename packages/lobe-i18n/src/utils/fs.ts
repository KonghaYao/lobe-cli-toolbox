import fs from 'fs-extra';
import stringify from 'json-stable-stringify';

export const readJSON = (filePath: string) => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

export const writeJSON = (filePath: string, data: any) => {
  const jsonStr = stringify(data, { space: '  ' });
  fs.outputFileSync(filePath, jsonStr, 'utf8');
};

export const readMarkdown = (filePath: string): string => {
  return fs.readFileSync(filePath, 'utf8');
};

export const writeMarkdown = (filePath: string, data: string) => {
  fs.outputFileSync(filePath, data, 'utf8');
};
