module.exports = {
  markdown: {
    entry: ['./test.md'],
    entryLocale: 'zn-CN',
    entryExtension: '.md',
    outputLocales: ['en-US'],
    outputExtensions: (locale, { getDefaultExtension }) => {
      return '.md';
    },
    outputFileName: (locale, targetFileName) => {
      // return targetFileName.replace('docs', 'i18n\\'+ locale + '\\docs');
      return targetFileName.replace('.md', '_' + locale + '.md');
    },
    afterTranslate: (result) => {
      console.log('afterTranslate');
      return result.replace(/\\===/g, '===');
    },
  },
};
