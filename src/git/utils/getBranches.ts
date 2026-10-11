import {getCmdResult} from '../../common/index.ts';
import {type IBranch} from './IBranch.ts';
import {parseBranches} from './parseBranches.ts';
import {sortBranches} from './sortBranches.ts';
import {filterBranches} from './filterBranches.ts';

export const getBranches = async (
  repositoryPath: string,
  includeRemote: boolean,
  filter?: string,
): Promise<IBranch[]> => {
  const gitArgs = ['branch', '--list', '--no-color'];

  if (includeRemote) {
    gitArgs.push('-a');
  }

  return getCmdResult('git', gitArgs, repositoryPath)
    .then(parseBranches)
    .then(sortBranches)
    .then((branches) => filterBranches(branches, filter));
};
