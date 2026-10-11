import {EOL} from 'node:os';
import chalk from 'chalk';
import {positionalArgsRegexProvider} from './positionalArgsRegexProvider.ts';
import {namedArgsRegexProvider} from './namedArgsRegexProvider.ts';
import {dashArgsRegexProvider} from './dashArgsRegexProvider.ts';

const controlOperators = new Set(['&&', '||']);

export const colorizeCommand = (commandText: string): string => {
  const cmdSplit = commandText.split(' ');

  return cmdSplit
    .map((cmdPart, index) => {
      const previousPart = cmdSplit[index - 1];

      if (index === 0 || controlOperators.has(previousPart)) {
        return chalk.greenBright(cmdPart);
      }

      if (cmdPart.includes('${cwd}')) {
        return chalk.blue(cmdPart);
      }

      if (positionalArgsRegexProvider().test(cmdPart)) {
        return chalk.yellow(cmdPart);
      }

      if (namedArgsRegexProvider().test(cmdPart)) {
        return chalk.yellow(cmdPart);
      }

      if (dashArgsRegexProvider().test(cmdPart)) {
        return chalk.blue(cmdPart);
      }

      return controlOperators.has(cmdPart)
        ? `${EOL}${chalk.cyanBright(cmdPart)}`
        : cmdPart;
    })
    .join(' ');
};
