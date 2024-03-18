import { runCmdInConsole } from '../../common';

export const deleteBranch = (
  branchName: string,
  {
    alsoDeleteRemote = false,
    noVerify = false,
    force = false
  }: { alsoDeleteRemote: boolean; noVerify: boolean; force: boolean }
): Promise<void> => {
  const args = ['branch', '-d', branchName];

  if (force) {
    args[1] = '-D';
  }

  return runCmdInConsole('git', args).then(() => {
    if (alsoDeleteRemote) {
      return runCmdInConsole('git', [
        'push',
        'origin',
        '--delete',
        branchName,
        noVerify ? '--no-verify' : ''
      ]);
    }

    return Promise.resolve();
  });
};
