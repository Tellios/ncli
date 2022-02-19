import {
  ConsoleInterface,
  IProcessOptions,
  ParallelProcesses,
  SequentialProcesses
} from '../../common';
import { parseCommand } from './parseCommand';
import { resolveMissingArguments } from './resolveMissingArguments';
import { parseUserArguments } from './parseUserArguments';
import { injectArguments } from './injectArguments';
import { ExecutionPlan, IAlias } from '../alias.interfaces';
import { IUserArguments } from '.';
import chalk = require('chalk');
import { ProcessesBase } from '../../common/process/ProcessesBase';

export const executeAlias = async (
  alias: IAlias,
  print: boolean,
  args: string[]
): Promise<void> => {
  const executionPlan = parseCommand(alias.cmd);

  const userArguments = await resolveMissingArguments(
    executionPlan,
    parseUserArguments(args)
  );

  if (print) {
    printExecutionPlan(executionPlan, userArguments);
  } else if (alias.type === 'parallel') {
    await executeParallelPlan(
      executionPlan,
      userArguments,
      alias.workingDirectory
    );
  } else {
    await executeSequentialPlan(
      executionPlan,
      userArguments,
      alias.workingDirectory
    );
  }
};

const printExecutionPlan = (
  executionPlan: ExecutionPlan,
  userArguments: IUserArguments
) => {
  for (const step of executionPlan) {
    const commandTexts = injectArguments(
      step.commands,
      userArguments,
      process.cwd()
    );

    if (step.type === 'sequential') {
      ConsoleInterface.printLine(chalk.cyanBright('Sequential: ['));
    } else {
      ConsoleInterface.printLine(chalk.bgMagentaBright('Sequential: ['));
    }

    for (const commandText of commandTexts) {
      ConsoleInterface.printLine(`  ${commandText}`);
    }

    ConsoleInterface.printLine(']');
  }
};

const executeSequentialPlan = async (
  executionPlan: ExecutionPlan,
  userArguments: IUserArguments,
  aliasWorkingDirectory: string | undefined
): Promise<void> => {
  for await (const step of executionPlan) {
    const commandTexts = injectArguments(
      step.commands,
      userArguments,
      process.cwd()
    );

    const options = commandTexts.map(
      (commandText): IProcessOptions => {
        const [executable, ...args] = commandText.split(' ');

        return {
          name: step.name ?? executable,
          args,
          executable,
          workingDirectory: step.workingDirectory ?? aliasWorkingDirectory
        };
      }
    );

    const processor =
      step.type === 'sequential'
        ? new SequentialProcesses(options)
        : new ParallelProcesses(options);

    await processor.run({});
  }
};

const executeParallelPlan = async (
  executionPlan: ExecutionPlan,
  userArguments: IUserArguments,
  aliasWorkingDirectory: string | undefined
): Promise<void> => {
  const processors: ProcessesBase[] = [];

  for (const step of executionPlan) {
    const commandTexts = injectArguments(
      step.commands,
      userArguments,
      process.cwd()
    );

    const options = commandTexts.map(
      (commandText): IProcessOptions => {
        const [executable, ...args] = commandText.split(' ');

        return {
          name: step.name ?? executable,
          args,
          executable,
          workingDirectory: step.workingDirectory ?? aliasWorkingDirectory
        };
      }
    );

    const processor =
      step.type === 'sequential'
        ? new SequentialProcesses(options)
        : new ParallelProcesses(options);

    processors.push(processor);
  }

  await Promise.all(processors.map((p) => p.run({})));
};
