import {selectItem} from '../../common/index.ts';
import {getBranches} from './getBranches.ts';
import {type IBranch} from './IBranch.ts';
import {filterBranches} from './filterBranches.ts';
import {branchNameColoring} from './branchNameColoring.ts';

export async function selectBranch(
  workingDirectory: string,
  includeRemote: boolean,
  message = 'Select branch',
  filter?: string,
): Promise<IBranch> {
  let branches = await getBranches(workingDirectory, includeRemote);
  branches = branches.filter((branch) => !branch.isCurrent);
  branches = filterBranches(branches, filter);

  const itemIndex = await selectItem(branchNameColoring(branches), message);

  return branches[itemIndex];
}
