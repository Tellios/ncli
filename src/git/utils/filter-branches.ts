import { type Branch } from './branch.interface.ts';

export function filterBranches(branches: Branch[], filter?: string): Branch[] {
  if (filter !== undefined && filter.length > 0) {
    const trimmedFilter = filter.trim().toLowerCase();

    if (trimmedFilter.length > 0) {
      return branches.filter((branch) =>
        branch.name.toLowerCase().includes(trimmedFilter)
      );
    }
  }

  return branches;
}
