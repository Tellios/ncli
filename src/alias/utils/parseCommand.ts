import { positionalArgsRegexProvider } from '../../common';
import {
  ExecutionPlan,
  IAlias,
  IAliasTask,
  ICommand,
  isAliasTask
} from '../alias.interfaces';

export const parseCommand = (alias: IAlias): ExecutionPlan => {
  if (Array.isArray(alias.cmd)) {
    if (isAliasTask(alias.cmd[0])) {
      return (alias.cmd as IAliasTask[]).map((task) => ({
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
        type: alias.type ?? 'sequential',
        commands: (alias.cmd as string[]).map(parseCommandText)
      }
    ];
  } else if (alias.cmd === '') {
    throw new Error('Command text is an empty string');
  } else {
    return [
      {
        type: alias.type ?? 'sequential',
        commands: [parseCommandText(alias.cmd)]
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
