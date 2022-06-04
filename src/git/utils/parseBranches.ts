import { IBranch } from './IBranch';

const currentBranchPrefix = '* ';
const remoteBranchPrefix = 'remotes/';

export function parseBranches(branchData: string): IBranch[] {
  return (
    branchData
      .split('\n')
      // Remove the HEAD pointer from the result and any empty rows
      .filter((branch) => !branch.includes('->') && branch.trim().length !== 0)
      .map((branchString: string): IBranch => {
        // git branch returns branches with a small indentation to make room for
        // the current branch marker. We make sure to remove that indentation here.
        const branchName = branchString.slice(2);

        const isRemote = branchName.startsWith(remoteBranchPrefix);

        return {
          name: branchName,
          isRemote: isRemote,
          isCurrent: branchString.startsWith(currentBranchPrefix)
        };
      })
  );
}
