import {runCmdInConsole} from '../../common/index.ts';
import {setUpstream} from './set-upstream.ts';

export const createBranch = async (
  branchName: string,
  pushToRemote: boolean,
  useNoVerify: boolean,
): Promise<void> =>
  runCmdInConsole('git', ['checkout', '-b', branchName]).then(async () =>
    pushToRemote ? setUpstream(branchName, useNoVerify) : Promise.resolve(),
  );
