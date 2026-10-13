import { runCmdInConsole } from '../../common/index.ts';
import { appendNoVerifyIfEnabled } from './append-no-verify-if-enabled.ts';
import { push } from './push.ts';

/*
 * Since it is a bunch of code that is required to create a commit using
 * nodegit I just use git cli instead. Git cli will take the necessary
 * steps needed to select proper configurations and such.
 */
export const commit = async (
  workingDirectory: string,
  message: string | undefined,
  pushCommit: boolean,
  useNoVerify: boolean,
  alsoPushTags: boolean,
  amend: boolean,
  forcePush: boolean,
  sign: boolean
): Promise<void> => {
  const commitArgs = appendNoVerifyIfEnabled(useNoVerify, [
    'commit',
    ...(sign ? ['-S'] : []),
    ...(message ? ['-m', message] : []),
    ...(amend ? ['--amend'] : []),
    ...(amend && !message ? ['--no-edit'] : [])
  ]);

  return runCmdInConsole('git', commitArgs)
    .then(async () =>
      pushCommit
        ? push(workingDirectory, useNoVerify, alsoPushTags, forcePush)
        : Promise.resolve()
    )
    .catch(() => {
      throw new Error('Commit action failed');
    });
};
