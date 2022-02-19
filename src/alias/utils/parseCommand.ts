import { positionalArgsRegexProvider } from '../../common';
import {
  ExecutionPlan,
  IAliasTask,
  ICommand,
  isAliasTask
} from '../alias.interfaces';

export const parseCommand = (
  command: string | string[] | IAliasTask[]
): ExecutionPlan => {
  if (Array.isArray(command)) {
    if (isAliasTask(command[0])) {
      return (command as IAliasTask[]).map((task) => ({
        type: task.type ?? 'sequential',
        name: task.name,
        workingDirectory: task.workingDirectory,
        commands: Array.isArray(task.cmd)
          ? task.cmd.map(parseCommandText)
          : [parseCommandText(task.cmd)]
      }));
    }

    return [
      {
        type: 'sequential',
        commands: (command as string[]).map(parseCommandText)
      }
    ];
  } else if (command === '') {
    throw new Error('Command text is an empty string');
  } else {
    return [
      {
        type: 'sequential',
        commands: [parseCommandText(command)]
      }
    ];
  }
};

const parseCommandText = (commandText: string): ICommand => {
  const positionalArgsRegex = positionalArgsRegexProvider();
  const positionalArguments = new Set<string>();
  let matches: string[] | null;

  while ((matches = positionalArgsRegex.exec(commandText)) !== null) {
    positionalArguments.add(matches[0]);
  }

  return {
    commandText,
    positionalArguments: [...positionalArguments.values()]
  };
};
