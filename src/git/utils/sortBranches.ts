import {type IBranch} from './IBranch.ts';

export function sortBranches(branches: IBranch[]): IBranch[] {
  return branches.sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) {
      return -1;
    }

    return a.isRemote && !b.isRemote ? 1 : a.name.localeCompare(b.name);
  });
}
