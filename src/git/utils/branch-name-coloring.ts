import { styleText } from 'node:util';
import { type Branch } from './branch.interface.ts';

export const branchNameColoring = (branches: Branch[]): string[] =>
  branches.map((branch) => {
    const color = branch.isCurrent
      ? 'green'
      : branch.isRemote
        ? 'cyan'
        : 'blue';

    return styleText(color, branch.name);
  });
