import { colorizeCommand } from '../../common';
import { IAlias } from '../alias.interfaces';

export const getAliasHelpTableContent = (
  alias: IAlias
): Array<Record<string, unknown>[]> => {
  const texts: any[] = [];

  if (alias.description) {
    texts.push({ description: alias.description });
  }

  if (Array.isArray(alias.cmd)) {
    texts.push(
      ...alias.cmd.map((cmd, index) => {
        const key = `cmd ${index + 1}`;

        return {
          [key]: colorizeCommand(cmd)
        };
      })
    );
  } else {
    texts.push({ cmd: colorizeCommand(alias.cmd) });
  }

  return texts;
};
