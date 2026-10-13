import { yargsWrapper, commandBase } from '../common/index.ts';
import {
  getCurrentBranch,
  selectBranch,
  checkout,
  merge,
  localizeBranchName
} from './utils/index.ts';

const args = yargsWrapper()
  .option('branch', {
    alias: 'b',
    describe: 'Specifies the branch to merge to',
    type: 'string'
  })
  .option('filter', {
    alias: 'f',
    describe: 'Optional filter if no branch is specified',
    type: 'string'
  })
  .parseSync();

async function getBranchToMergeTo(workingDirectory: string): Promise<string> {
  if (args.branch && args.branch.length > 0) {
    return args.branch;
  }

  return selectBranch(
    workingDirectory,
    false,
    'Select branch to merge TO',
    args.filter
  ).then((branch) => branch.name);
}

await commandBase(async ({ workingDirectory }) => {
  const [sourceBranch, targetBranch] = await Promise.all([
    getCurrentBranch(workingDirectory),
    getBranchToMergeTo(workingDirectory)
  ]);

  await checkout(localizeBranchName(targetBranch));
  await merge(localizeBranchName(sourceBranch.name));
});
