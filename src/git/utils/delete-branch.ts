import { runCmdInConsole } from '../../common/index.ts';

export const deleteBranch = async (
  branchName: string,
  {
    alsoDeleteRemote,
    noVerify,
    force
  }: { alsoDeleteRemote: boolean; noVerify: boolean; force: boolean }
): Promise<void> => {
  const args = ['branch', '-d', branchName];

  if (force) {
    args[1] = '-D';
  }

  return runCmdInConsole('git', args).then(async () => {
    if (alsoDeleteRemote) {
      return runCmdInConsole('git', [
        'push',
        'origin',
        '--delete',
        branchName,
        noVerify ? '--no-verify' : ''
      ]);
    }
  });
};
