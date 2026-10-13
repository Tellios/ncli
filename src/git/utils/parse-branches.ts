import { type Branch } from './branch.interface.ts';

const currentBranchPrefix = '* ';
const remoteBranchPrefix = 'remotes/';

export function parseBranches(branchData: string): Branch[] {
  return (
    branchData
      .split('\n')
      // Remove the HEAD pointer from the result and any empty rows
      .filter((branch) => !branch.includes('->') && branch.trim().length > 0)
      .map((branchString: string): Branch => {
        // Git branch returns branches with a small indentation to make room for
        // the current branch marker. We make sure to remove that indentation here.
        const branchName = branchString.slice(2);

        const isRemote = branchName.startsWith(remoteBranchPrefix);

        return {
          name: branchName,
          isRemote,
          isCurrent: branchString.startsWith(currentBranchPrefix)
        };
      })
  );
}
