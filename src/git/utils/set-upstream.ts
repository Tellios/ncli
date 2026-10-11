import {runCmdInConsole} from '../../common/index.ts';
import {appendNoVerifyIfEnabled} from './append-no-verify-if-enabled.ts';

export async function setUpstream(
  branchName: string,
  useNoVerify: boolean,
): Promise<void> {
  let upstreamArgs = ['push', '--set-upstream', 'origin', branchName];
  upstreamArgs = appendNoVerifyIfEnabled(useNoVerify, upstreamArgs);

  await runCmdInConsole('git', upstreamArgs);
}
