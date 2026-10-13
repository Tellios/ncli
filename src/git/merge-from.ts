import { yargsWrapper, commandBase } from '../common/index.ts';
import { selectBranch, merge } from './utils/index.ts';

const args = yargsWrapper()
  .option('branch', {
    alias: 'b',
    describe: 'Specifies the branch to merge from',
    type: 'string'
  })
  .option('filter', {
    alias: 'f',
    describe: 'Optional filter if no branch is specified',
    type: 'string'
  }).argv;

async function getBranchToMergeFrom(workingDirectory: string): Promise<string> {
  if (args.branch && args.branch.length > 0) {
    return args.branch;
  }

  return selectBranch(
    workingDirectory,
    false,
    'Select branch to merge FROM',
    args.filter
  ).then((branch) => branch.name);
}

await commandBase(async ({ workingDirectory }) => {
  const branch = await getBranchToMergeFrom(workingDirectory);
  await merge(branch);
});
