import {colorizeCommand} from '../../common/index.ts';
import {type ICommand} from '../alias.interfaces.ts';
import {type IUserArguments} from './parseUserArguments.ts';

export const injectArguments = (
  commands: ICommand[],
  userArguments: IUserArguments,
  workingDirectory: string,
): string[] =>
  commands.map((command) =>
    injectArgumentsIntoCommandText(
      command.commandText,
      command.positionalArguments,
      userArguments,
      workingDirectory,
    ),
  );

function injectArgumentsIntoCommandText(
  commandText: string,
  positionalArguments: string[],
  userArguments: IUserArguments,
  workingDirectory: string,
): string {
  if (
    positionalArguments.length > 0 &&
    userArguments.positional.length < positionalArguments.length
  ) {
    throw new Error(
      `Some positional arguments are missing: ${colorizeCommand(commandText)}`,
    );
  }

  let commandWithArgs = commandText;

  for (const posArg of positionalArguments) {
    const userArgumentsIndex = Number(posArg.slice(1)) - 1;
    const userArg = userArguments.positional[userArgumentsIndex];

    while (commandWithArgs.includes(posArg)) {
      commandWithArgs = commandWithArgs.replace(posArg, userArg);
    }
  }

  for (const entry of Object.entries(userArguments.named)) {
    const [key, value] = entry;
    const commandKey = `\${${key}}`;

    while (commandWithArgs.includes(commandKey)) {
      commandWithArgs = commandWithArgs.replace(commandKey, value);
    }
  }

  if (userArguments.appended.length > 0) {
    commandWithArgs += ' ' + userArguments.appended.join(' ');
  }

  commandWithArgs = commandWithArgs.replaceAll('${cwd}', workingDirectory);

  // Console.log(commandText, positionalArguments, userArguments, commandWithArgs);

  return commandWithArgs;
}
