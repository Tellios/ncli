import { commandBase, yargsWrapper } from '../common/index.ts';
import {
  getCurrentBranch,
  localizeBranchName,
  setUpstream
} from './utils/index.ts';

const args = yargsWrapper().option('noVerify', {
  alias: 'n',
  describe: 'Add --no-verify to git push command',
  type: 'boolean',
  default: false
}).argv;

await commandBase(async ({ workingDirectory }) => {
  const branch = await getCurrentBranch(workingDirectory);
  await setUpstream(localizeBranchName(branch.name), args.noVerify);
});
