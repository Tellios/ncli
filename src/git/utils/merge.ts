import { CmdError, runCmdInConsole } from '../../common/index.ts';

export const merge = async (sourceBranch: string): Promise<void> =>
  runCmdInConsole('git', ['merge', '--no-ff', sourceBranch]).catch(
    (error: unknown) => {
      if (error instanceof CmdError && 'exitCode' in error) {
        throw new Error(`Merge failed: ${error.processMessage}`, {
          cause: CmdError
        });
      }

      throw error;
    }
  );
