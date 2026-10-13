import { EOL } from 'node:os';
import { styleText } from 'node:util';
import { positionalArgsRegexProvider } from './positional-args-regex-provider.ts';
import { namedArgsRegexProvider } from './named-args-regex-provider.ts';
import { dashArgsRegexProvider } from './dash-args-regex-provider.ts';

const controlOperators = new Set(['&&', '||']);

export const colorizeCommand = (commandText: string): string => {
  const cmdSplit = commandText.split(' ');

  return cmdSplit
    .map((cmdPart, index) => {
      const previousPart = cmdSplit[index - 1];

      if (index === 0 || controlOperators.has(previousPart)) {
        return styleText('greenBright', cmdPart);
      }

      // This is intended, it is part of the config file format
      // eslint-disable-next-line no-template-curly-in-string
      if (cmdPart.includes('${cwd}')) {
        return styleText('blue', cmdPart);
      }

      if (positionalArgsRegexProvider().test(cmdPart)) {
        return styleText('yellow', cmdPart);
      }

      if (namedArgsRegexProvider().test(cmdPart)) {
        return styleText('yellow', cmdPart);
      }

      if (dashArgsRegexProvider().test(cmdPart)) {
        return styleText('blue', cmdPart);
      }

      return controlOperators.has(cmdPart)
        ? `${EOL}${styleText('cyanBright', cmdPart)}`
        : cmdPart;
    })
    .join(' ');
};
