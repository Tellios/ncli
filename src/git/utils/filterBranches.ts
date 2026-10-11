import {type IBranch} from './IBranch.ts';

export function filterBranches(
  branches: IBranch[],
  filter?: string,
): IBranch[] {
  if (filter) {
    const trimmedFilter = filter.trim().toLowerCase();

    if (trimmedFilter.length > 0) {
      return branches.filter((branch) =>
        branch.name.toLowerCase().includes(trimmedFilter),
      );
    }
  }

  return branches;
}
