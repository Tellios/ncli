import {getCmdResult} from '../../common/index.ts';
import {type Branch} from './branch.interface.ts';
import {parseBranches} from './parse-branches.ts';
import {sortBranches} from './sort-branches.ts';
import {filterBranches} from './filter-branches.ts';

export const getBranches = async (
  repositoryPath: string,
  includeRemote: boolean,
  filter?: string,
): Promise<Branch[]> => {
  const gitArgs = ['branch', '--list', '--no-color'];

  if (includeRemote) {
    gitArgs.push('-a');
  }

  return getCmdResult('git', gitArgs, repositoryPath)
    .then(parseBranches)
    .then(sortBranches)
    .then((branches) => filterBranches(branches, filter));
};
