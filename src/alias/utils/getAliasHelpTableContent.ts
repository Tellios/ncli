import * as chalk from 'chalk';
import { colorizeCommand } from '../../common';
import { IAlias } from '../alias.interfaces';

export const getAliasHelpTableContent = (
  alias: IAlias
): Array<Record<string, unknown>[]> => {
  const texts: any[] = [];

  texts.push({ name: alias.name });

  if (alias.description) {
    texts.push({ description: alias.description });
  }

  if (Array.isArray(alias.cmd)) {
    texts.push(
      ...alias.cmd.map((cmd, index) => {
        const key = `cmd ${index + 1}`;

        if (typeof cmd === 'string') {
          return {
            [key]: colorizeCommand(cmd)
          };
        }

        return {
          [key]: chalk.yellow('[task]')
        };
      })
    );
  } else {
    texts.push({ cmd: colorizeCommand(alias.cmd) });
  }

  return texts;
};
