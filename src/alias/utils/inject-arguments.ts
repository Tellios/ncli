import {colorizeCommand} from '../../common/index.ts';
import {type Command} from '../alias.interfaces.ts';
import {type UserArguments} from './parse-user-arguments.ts';

export const injectArguments = (
  commands: Command[],
  userArguments: UserArguments,
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
  userArguments: UserArguments,
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
