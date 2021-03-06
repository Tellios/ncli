import * as chalk from 'chalk';
import { yargsWrapper, ConsoleInterface, commandBase } from '../common';
import { getStatus, IGitStatus } from './utils';

const args = yargsWrapper()
  .option('new', {
    alias: 'n',
    describe: 'Only show new files',
    type: 'boolean',
    default: false
  })
  .option('modified', {
    alias: 'm',
    describe: 'Only show modified files',
    type: 'boolean',
    default: false
  })
  .option('deleted', {
    alias: 'd',
    describe: 'Only show deleted files',
    type: 'boolean',
    default: false
  }).argv;

const getOrIgnore = (ignore: boolean, files: string[]): string[] => {
  if (ignore) {
    return [];
  }

  return files;
};

const getStatusOutput = (status: IGitStatus): string[] => {
  return [
    ...getOrIgnore(
      args.modified || args.deleted,
      status.newFiles.map((file: string) => chalk.green(`+ ${file}`))
    ),
    ...getOrIgnore(
      args.new || args.deleted,
      status.changedFiles.map((file: string) => chalk.yellow(`M ${file}`))
    ),
    ...getOrIgnore(
      args.new || args.modified,
      status.deletedFiles.map((file: string) => chalk.red(`- ${file}`))
    )
  ];
};

commandBase(async ({ workingDirectory }) => {
  const status = await getStatus(workingDirectory);

  if (status.hasChanges) {
    ConsoleInterface.printLines(getStatusOutput(status));
  } else {
    ConsoleInterface.printLine('Nothing to commit');
  }
});
