import { runCmdInConsole } from '../../common/index.ts';

const GIT_URL_SUFFIX = '.git';

function getDirectoryNameFromUrl(url: string): string {
  const directoryName = url.slice(url.lastIndexOf('/') + 1);

  return directoryName.endsWith(GIT_URL_SUFFIX)
    ? directoryName.slice(
        0,
        Math.max(0, directoryName.length - GIT_URL_SUFFIX.length)
      )
    : directoryName;
}

export const clone = async (
  cloneUrl: string,
  directoryName?: string
): Promise<string> => {
  const checkoutDir =
    !directoryName || directoryName.length === 0
      ? getDirectoryNameFromUrl(cloneUrl)
      : directoryName;

  return runCmdInConsole('git', ['clone', cloneUrl, checkoutDir]).then(
    () => checkoutDir
  );
};
