import {positionalArgsRegexProvider} from '../../common/index.ts';
import {
  type ExecutionPlan,
  type IAlias,
  type IAliasTask,
  type ICommand,
  isAliasTask,
} from '../alias.interfaces.ts';

export const parseCommand = (alias: IAlias): ExecutionPlan => {
  if (Array.isArray(alias.cmd)) {
    if (isAliasTask(alias.cmd[0])) {
      return (alias.cmd as IAliasTask[]).map((task) => ({
        type: task.type ?? 'sequential',
        name: task.name,
        workingDirectory: task.workingDirectory,
        interactive: task.interactive ?? alias.interactive,
        commands: Array.isArray(task.cmd)
          ? task.cmd.map(parseCommandText)
          : [parseCommandText(task.cmd)],
      }));
    }

    return [
      {
        type: alias.type ?? 'sequential',
        interactive: alias.interactive,
        commands: (alias.cmd as string[]).map(parseCommandText),
      },
    ];
  }

  if (alias.cmd === '') {
    throw new Error('Command text is an empty string');
  }

  return [
    {
      type: alias.type ?? 'sequential',
      interactive: alias.interactive,
      commands: [parseCommandText(alias.cmd)],
    },
  ];
};

const parseCommandText = (commandText: string): ICommand => {
  const positionalArgsRegex = positionalArgsRegexProvider();
  const positionalArguments = new Set<string>();
  let matches: string[] | undefined;

  while ((matches = positionalArgsRegex.exec(commandText)) !== null) {
    positionalArguments.add(matches[0]);
  }

  return {
    commandText,
    positionalArguments: [...positionalArguments],
  };
};
