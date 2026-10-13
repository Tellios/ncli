import { runCmdInConsole, CmdError, confirm } from '../../common/index.ts';
import { getCurrentBranch } from './get-current-branch.ts';
import { setUpstream } from './set-upstream.ts';
import { appendNoVerifyIfEnabled } from './append-no-verify-if-enabled.ts';

export async function push(
  workingDirectory: string,
  useNoVerify: boolean,
  alsoPushTags: boolean,
  force: boolean
): Promise<void> {
  try {
    if (
      force &&
      !(await confirm(
        'WARNING: Force push will be performed, are you sure you want to continue?'
      ))
    ) {
      throw new Error('Push aborted');
    }

    let pushArgs = ['push'];
    pushArgs = appendNoVerifyIfEnabled(useNoVerify, pushArgs);

    if (force) {
      pushArgs.push('--force');
    }

    await runCmdInConsole('git', pushArgs);

    if (alsoPushTags) {
      await pushTags(useNoVerify);
    }
  } catch (error) {
    if (error instanceof CmdError) {
      if (error.exitCode === 128) {
        if (
          await confirm(
            'Push failed, upstream may be missing, do you want to set it?'
          )
        ) {
          const currentBranch = await getCurrentBranch(workingDirectory);

          await setUpstream(currentBranch.name, useNoVerify);

          if (alsoPushTags) {
            await pushTags(useNoVerify);
          }
        } else {
          return;
        }
      } else {
        throw new Error(error.processMessage, { cause: error });
      }
    }

    throw error;
  }
}

const pushTags = async (useNoVerify: boolean): Promise<void> => {
  let pushArgs = ['push'];
  pushArgs = appendNoVerifyIfEnabled(useNoVerify, pushArgs);
  pushArgs.push('--tags');

  await runCmdInConsole('git', pushArgs);
};
