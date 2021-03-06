import { runCmdInConsole, CmdError } from '../../common';

export const merge = (sourceBranch: string): Promise<void> => {
  return runCmdInConsole('git', ['merge', '--no-ff', sourceBranch]).catch(
    (err: Error | CmdError) => {
      if ('exitCode' in err) {
        throw new Error(`Merge failed: ${err.processMessage}`);
      }

      throw err;
    }
  );
};
