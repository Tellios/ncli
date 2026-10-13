import { styleText } from 'node:util';
import { colorizeCommand } from '../../common/index.ts';
import { type Alias } from '../alias.interfaces.ts';

export const getAliasHelpTableContent = (
  alias: Alias
): Array<Array<Record<string, unknown>>> => {
  let texts: any[] = [
    { name: alias.name },
    ...(alias.description ? [{ description: alias.description }] : [])
  ];

  if (Array.isArray(alias.cmd)) {
    texts = [
      ...texts,
      ...alias.cmd.map((cmd, index) => {
        const key = `cmd ${index + 1}`;

        if (typeof cmd === 'string') {
          return {
            [key]: colorizeCommand(cmd)
          };
        }

        return {
          [key]: styleText('yellow', '[task]')
        };
      })
    ];
  } else {
    texts.push({ cmd: colorizeCommand(alias.cmd) });
  }

  return texts;
};
