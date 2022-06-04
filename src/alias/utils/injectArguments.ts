import { colorizeCommand } from '../../common';
import { IUserArguments } from './parseUserArguments';
import { ICommand } from '../alias.interfaces';

export const injectArguments = (
  commands: ICommand[],
  userArguments: IUserArguments,
  workingDirectory: string
): string[] => {
  return commands.map((command) =>
    injectArgumentsIntoCommandText(
      command.commandText,
      command.positionalArguments,
      userArguments,
      workingDirectory
    )
  );
};

function injectArgumentsIntoCommandText(
  commandText: string,
  positionalArguments: string[],
  userArguments: IUserArguments,
  workingDirectory: string
): string {
  if (
    positionalArguments.length > 0 &&
    userArguments.positional.length < positionalArguments.length
  ) {
    throw Error(
      `Some positional arguments are missing: ${colorizeCommand(commandText)}`
    );
  }

  let commandWithArgs = commandText;

  positionalArguments.forEach((posArg) => {
    const userArgumentsIndex = Number(posArg.substr(1)) - 1;
    const userArg = userArguments.positional[userArgumentsIndex];

    while (commandWithArgs.indexOf(posArg) !== -1) {
      commandWithArgs = commandWithArgs.replace(posArg, userArg);
    }
  });

  Object.entries(userArguments.named).forEach((entry) => {
    const [key, value] = entry;
    const commandKey = `\${${key}}`;

    while (commandWithArgs.indexOf(commandKey) !== -1) {
      commandWithArgs = commandWithArgs.replace(commandKey, value);
    }
  });

  if (userArguments.appended.length > 0) {
    commandWithArgs += ' ' + userArguments.appended.join(' ');
  }

  commandWithArgs = commandWithArgs.replace(/\${cwd}/g, workingDirectory);

  // console.log(commandText, positionalArguments, userArguments, commandWithArgs);

  return commandWithArgs;
}
