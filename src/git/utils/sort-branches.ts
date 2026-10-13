import { type Branch } from './branch.interface.ts';

export function sortBranches(branches: Branch[]): Branch[] {
  return branches.toSorted((a, b) => {
    if (a.isCurrent && !b.isCurrent) {
      return -1;
    }

    return a.isRemote && !b.isRemote ? 1 : a.name.localeCompare(b.name);
  });
}
