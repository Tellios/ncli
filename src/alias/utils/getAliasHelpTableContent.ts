import chalk from 'chalk';
import {colorizeCommand} from '../../common/index.ts';
import {type IAlias} from '../alias.interfaces.ts';

export const getAliasHelpTableContent = (
  alias: IAlias,
): Array<Array<Record<string, unknown>>> => {
  const texts: any[] = [{name: alias.name}];

  if (alias.description) {
    texts.push({description: alias.description});
  }

  if (Array.isArray(alias.cmd)) {
    texts.push(
      ...alias.cmd.map((cmd, index) => {
        const key = `cmd ${index + 1}`;

        if (typeof cmd === 'string') {
          return {
            [key]: colorizeCommand(cmd),
          };
        }

        return {
          [key]: chalk.yellow('[task]'),
        };
      }),
    );
  } else {
    texts.push({cmd: colorizeCommand(alias.cmd)});
  }

  return texts;
};
