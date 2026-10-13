import chalk from 'chalk';
import { type Branch } from './branch.interface.ts';

export const branchNameColoring = (branches: Branch[]): string[] =>
  branches.map((branch) => {
    if (branch.isCurrent) {
      return chalk.green(branch.name);
    }

    return branch.isRemote ? chalk.cyan(branch.name) : chalk.blue(branch.name);
  });
