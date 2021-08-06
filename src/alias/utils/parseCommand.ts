import { positionalArgsRegexProvider } from '../../common';
import { ICommand } from '../alias.interfaces';

export const parseCommand = (commandText: string | string[]): ICommand[] => {
  const commands: string[] = [];

  if (Array.isArray(commandText)) {
    if (commandText.length === 0) {
      throw new Error('Command is an empty array');
    }

    if (commandText.some((cmd) => cmd === '')) {
      throw new Error('One or more command texts is an empty string');
    }

    commands.push(...commandText);
  } else if (commandText === '') {
    throw new Error('Command text is an empty string');
  } else {
    commands.push(commandText);
  }

  return commands.map(
    (cmd): ICommand => {
      const positionalArgsRegex = positionalArgsRegexProvider();
      const positionalArguments = new Set<string>();
      let matches: string[] | null;

      while ((matches = positionalArgsRegex.exec(cmd)) !== null) {
        positionalArguments.add(matches[0]);
      }

      return {
        commandText: cmd,
        positionalArguments: [...positionalArguments.values()]
      };
    }
  );
};
