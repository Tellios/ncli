import chalk from 'chalk';
import {
  ConsoleInterface,
  type ProcessOptions,
  ParallelProcesses,
  SequentialProcesses,
  Type,
} from '../../common/index.ts';
import {
  type ExecutionPlan,
  type Alias,
  type ExecutionStep,
} from '../alias.interfaces.ts';
import {type ProcessesBase} from '../../common/process/processes-base.ts';
import {parseCommand} from './parse-command.ts';
import {resolveMissingArguments} from './resolve-missing-arguments.ts';
import {parseUserArguments} from './parse-user-arguments.ts';
import {injectArguments} from './inject-arguments.ts';
import {type UserArguments} from './index.ts';
import {resolveStepInteractive} from './detect-interactive-command.ts';

export const executeAlias = async (
  alias: Alias,
  print: boolean,
  args: string[],
): Promise<void> => {
  const executionPlan = parseCommand(alias);

  const userArguments = await resolveMissingArguments(
    executionPlan,
    parseUserArguments(args),
  );

  if (print) {
    printExecutionPlan(alias, executionPlan, userArguments);
  } else if (alias.type === 'parallel') {
    await executeParallelPlan(
      executionPlan,
      userArguments,
      alias.workingDirectory,
    );
  } else {
    await executeSequentialPlan(
      executionPlan,
      userArguments,
      alias.workingDirectory,
    );
  }
};

const printExecutionPlan = (
  alias: Alias,
  executionPlan: ExecutionPlan,
  userArguments: UserArguments,
) => {
  ConsoleInterface.printLine(`Execution plan for ${alias.name}`);

  if (alias.type === undefined || alias.type === 'sequential') {
    ConsoleInterface.printLine(chalk.greenBright('Sequential: ['));
  } else {
    ConsoleInterface.printLine(chalk.greenBright('Parallel: ['));
  }

  for (const step of executionPlan) {
    const commandTexts = injectArguments(
      step.commands,
      userArguments,
      process.cwd(),
    );

    if (step.type === 'sequential') {
      ConsoleInterface.printLine(chalk.cyanBright('  Sequential: ['));
    } else {
      ConsoleInterface.printLine(chalk.magentaBright('  Parallel: ['));
    }

    for (const commandText of commandTexts) {
      ConsoleInterface.printLine(`    ${commandText}`);
    }

    if (step.type === 'sequential') {
      ConsoleInterface.printLine(chalk.cyanBright('  ]'));
    } else {
      ConsoleInterface.printLine(chalk.magentaBright('  ]'));
    }
  }

  ConsoleInterface.printLine(chalk.greenBright(']'));
};

const executeSequentialPlan = async (
  executionPlan: ExecutionPlan,
  userArguments: UserArguments,
  aliasWorkingDirectory: string | undefined,
): Promise<void> => {
  for await (const step of executionPlan) {
    const commandTexts = injectArguments(
      step.commands,
      userArguments,
      process.cwd(),
    );

    const options = commandTexts.map((commandText): ProcessOptions => {
      const [executable, ...args] = commandText.split(' ');
      const isInteractive = resolveStepInteractive(
        commandText,
        step.interactive,
      );

      return {
        name: step.name ?? executable,
        args,
        executable,
        workingDirectory: step.workingDirectory ?? aliasWorkingDirectory,
        interactive: isInteractive,
        shellCommand: isInteractive ? commandText : undefined,
      };
    });

    warnInteractiveStep(step, options);

    const processor =
      step.type === 'sequential'
        ? new SequentialProcesses(options)
        : new ParallelProcesses(options);

    await processor.run({
      stdout: process.stdout,
    });
  }
};

const executeParallelPlan = async (
  executionPlan: ExecutionPlan,
  userArguments: UserArguments,
  aliasWorkingDirectory: string | undefined,
): Promise<void> => {
  const processors: ProcessesBase[] = [];

  for (const step of executionPlan) {
    const commandTexts = injectArguments(
      step.commands,
      userArguments,
      process.cwd(),
    );

    const options = commandTexts.map((commandText): ProcessOptions => {
      const [executable, ...args] = commandText.split(' ');
      const isInteractive = resolveStepInteractive(
        commandText,
        step.interactive,
      );

      return {
        name: step.name ?? executable,
        args,
        executable,
        workingDirectory: step.workingDirectory ?? aliasWorkingDirectory,
        interactive: isInteractive,
        shellCommand: isInteractive ? commandText : undefined,
      };
    });

    warnInteractiveStep(step, options);

    const processor =
      step.type === 'sequential'
        ? new SequentialProcesses(options)
        : new ParallelProcesses(options);

    processors.push(processor);
  }

  await Promise.all(
    processors.map(async (p) =>
      p.run({
        stdout: process.stdout,
      }),
    ),
  );
};

const warnInteractiveStep = (
  step: ExecutionStep,
  options: ProcessOptions[],
): void => {
  if (options.every((option) => !option.interactive)) {
    return;
  }

  if (!process.stdin.isTTY) {
    ConsoleInterface.printLine(
      'Interactive alias requires a terminal (stdin is not a TTY)',
      Type.warn,
    );
  }

  if (step.type === 'parallel' && step.commands.length > 1) {
    ConsoleInterface.printLine(
      'Interactive mode is not supported for parallel steps with multiple commands',
      Type.warn,
    );
  }
};
