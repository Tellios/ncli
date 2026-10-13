import { getBranches } from './get-branches.ts';
import { type Branch } from './branch.interface.ts';

export const getCurrentBranch = async (
  workingDirectory: string
): Promise<Branch> =>
  getBranches(workingDirectory, true).then((branches) => {
    const currentBranch = branches.find((branch) => branch.isCurrent);

    if (!currentBranch) {
      throw new Error(
        'Unable to determine current branch from working directory'
      );
    }

    return currentBranch;
  });
