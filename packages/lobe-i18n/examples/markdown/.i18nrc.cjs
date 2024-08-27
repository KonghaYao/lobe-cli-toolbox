module.exports = {
  modelName: 'gpt-3.5-turbo',
  translateMap: {
    'en-US': {
      江夏尧: 'KonghaYao',
      维护日志: 'Logger',
    },
  },
  markdown: {
    entry: ['./README.zh-CN.md'],
    entryLocale: 'zh-CN',
    entryExtension: '.zh-CN.md',
    outputLocales: ['en-US'],
    outputExtensions: (locale, { getDefaultExtension }) => {
      if (locale === 'en-US') return '.md';
      return getDefaultExtension(locale);
    },
    includeMatter: true,
    outputFileName(locale, path) {
      return path.replace('/markdown/', '/markdown/dist/');
    },
  },
};
