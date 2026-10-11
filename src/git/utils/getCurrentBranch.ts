import {getBranches} from './getBranches.ts';
import {type IBranch} from './IBranch.ts';

export const getCurrentBranch = async (
  workingDirectory: string,
): Promise<IBranch> =>
  getBranches(workingDirectory, true).then((branches) => {
    const currentBranch = branches.find((branch) => branch.isCurrent);

    if (!currentBranch) {
      throw new Error(
        'Unable to determine current branch from working directory',
      );
    }

    return currentBranch;
  });
