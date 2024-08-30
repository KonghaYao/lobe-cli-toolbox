import path from 'node:path';

function correctRelativePath(fromPath: string, toPath: string, relativePath: string) {
  const fromDir = path.dirname(fromPath);
  const absolutePath = path.resolve(fromDir, relativePath);
  const toDir = path.dirname(toPath);
  const correctedRelativePath = path.relative(toDir, absolutePath);
  if (!correctedRelativePath.startsWith('.')) {
    return './' + correctedRelativePath;
  }
  return correctedRelativePath;
}
export const CommonRelativePathRegExp = /\.\.?\/[^\s)\]]*(?<!["')\]])/gm;

export const RelativePath = (
  MarkdownStr: string,
  context: {
    fromPath: string;
    match: RegExp[];
    toPath: string;
  },
) => {
  let str = MarkdownStr;
  for (const item of context.match) {
    try {
      str = str.replace(item, (first) => {
        return correctRelativePath(context.fromPath, context.toPath, first);
      });
    } catch (error) {
      console.error('RelativePath Error:', error);
    }
  }
  return str;
};
