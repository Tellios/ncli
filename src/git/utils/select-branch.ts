import {selectItem} from '../../common/index.ts';
import {getBranches} from './get-branches.ts';
import {type Branch} from './branch.interface.ts';
import {filterBranches} from './filter-branches.ts';
import {branchNameColoring} from './branch-name-coloring.ts';

export async function selectBranch(
  workingDirectory: string,
  includeRemote: boolean,
  message = 'Select branch',
  filter?: string,
): Promise<Branch> {
  let branches = await getBranches(workingDirectory, includeRemote);
  branches = branches.filter((branch) => !branch.isCurrent);
  branches = filterBranches(branches, filter);

  const itemIndex = await selectItem(branchNameColoring(branches), message);

  return branches[itemIndex];
}
