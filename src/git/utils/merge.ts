import {runCmdInConsole, type CmdError} from '../../common/index.ts';

export const merge = async (sourceBranch: string): Promise<void> =>
  runCmdInConsole('git', ['merge', '--no-ff', sourceBranch]).catch(
    (error: Error | CmdError) => {
      if ('exitCode' in error) {
        throw new Error(`Merge failed: ${error.processMessage}`);
      }

      throw error;
    },
  );
