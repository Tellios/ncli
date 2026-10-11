import chalk from 'chalk';
import {type IBranch} from './IBranch.ts';

export const branchNameColoring = (branches: IBranch[]): string[] =>
  branches.map((branch) => {
    if (branch.isCurrent) {
      return chalk.green(branch.name);
    }

    return branch.isRemote ? chalk.cyan(branch.name) : chalk.blue(branch.name);
  });
