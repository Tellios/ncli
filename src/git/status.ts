import { styleText } from 'node:util';
import {
  yargsWrapper,
  ConsoleInterface,
  commandBase
} from '../common/index.ts';
import { getStatus, type GitStatus } from './utils/index.ts';

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
  })
  .parseSync();

const getOrIgnore = (ignore: boolean, files: string[]): string[] =>
  ignore ? [] : files;

const getStatusOutput = (status: GitStatus): string[] => [
  ...getOrIgnore(
    args.modified || args.deleted,
    status.newFiles.map((file: string) => styleText('green', `+ ${file}`))
  ),
  ...getOrIgnore(
    args.new || args.deleted,
    status.changedFiles.map((file: string) => styleText('yellow', `M ${file}`))
  ),
  ...getOrIgnore(
    args.new || args.modified,
    status.deletedFiles.map((file: string) => styleText('red', `- ${file}`))
  )
];

await commandBase(async ({ workingDirectory }) => {
  const status = await getStatus(workingDirectory);

  if (status.hasChanges) {
    ConsoleInterface.printLines(getStatusOutput(status));
  } else {
    ConsoleInterface.printLine('Nothing to commit');
  }
});
