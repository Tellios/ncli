import {yargsWrapper, commandBase} from '../common/index.ts';
import {selectBranch, localizeBranchName, checkout} from './utils/index.ts';

const args = yargsWrapper()
  .option('branch', {
    alias: 'b',
    describe: 'Specifies the branch to switch to',
    type: 'string',
  })
  .option('remote', {
    alias: 'r',
    describe: 'Include remote branches when selecting branches',
    type: 'boolean',
    default: false,
  })
  .option('filter', {
    alias: 'f',
    describe: 'Branch name filter',
    type: 'string',
  }).argv;

async function getBranchToSwitchTo(workingDirectory: string): Promise<string> {
  if (args.branch && args.branch.length > 0) {
    return args.branch;
  }

  return selectBranch(
    workingDirectory,
    args.remote,
    'Select branch to switch to',
    args.filter,
  ).then((branch) => localizeBranchName(branch.name));
}

commandBase(async ({workingDirectory}) => {
  const branch = await getBranchToSwitchTo(workingDirectory);
  return checkout(branch);
});
