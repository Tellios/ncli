import { ConsoleInterface } from '../../common';
import { parseCommand } from './parseCommand';
import { resolveMissingArguments } from './resolveMissingArguments';
import { parseUserArguments } from './parseUserArguments';
import { injectArguments } from './injectArguments';
import { executeCmd } from './executeCommand';
import { IAlias } from '../alias.interfaces';

export const executeAlias = async (
  alias: IAlias,
  print: boolean,
  args: string[]
): Promise<void> => {
  const command = parseCommand(alias.cmd);
  const userArguments = await resolveMissingArguments(
    alias,
    parseUserArguments(args)
  );
  const commandTexts = injectArguments(command, userArguments, process.cwd());

  if (print) {
    for (const commandText of commandTexts) {
      ConsoleInterface.printLine(commandText);
    }
  } else {
    for (const commandText of commandTexts) {
      await executeCmd(commandText, alias.workingDirectory);
    }
  }
};
