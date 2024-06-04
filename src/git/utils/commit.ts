import { runCmdInConsole } from '../../common';
import { appendNoVerifyIfEnabled } from './appendNoVerifyIfEnabled';
import { push } from './push';

/*
 * Since it is a bunch of code that is required to create a commit using
 * nodegit I just use git cli instead. Git cli will take the necessary
 * steps needed to select proper configurations and such.
 */
export const commit = (
  workingDirectory: string,
  message: string | undefined,
  pushCommit: boolean,
  useNoVerify: boolean,
  alsoPushTags: boolean,
  amend: boolean,
  forcePush: boolean,
  sign: boolean
): Promise<void> => {
  let commitArgs = ['commit'];
  sign && commitArgs.push('-S');
  message && commitArgs.push('-m', message);
  amend && commitArgs.push('--amend');
  amend && !message && commitArgs.push('--no-edit');
  commitArgs = appendNoVerifyIfEnabled(useNoVerify, commitArgs);

  return runCmdInConsole('git', commitArgs)
    .then(() => {
      if (pushCommit) {
        return push(workingDirectory, useNoVerify, alsoPushTags, forcePush);
      }

      return Promise.resolve();
    })
    .catch(() => {
      throw new Error('Commit action failed');
    });
};
