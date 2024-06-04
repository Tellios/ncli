import * as chalk from 'chalk';
import {
  ConsoleInterface,
  Type,
  commandBase,
  selectItem,
  yargsWrapper
} from '../common';
import { getLog, showCommit } from './utils';

const args = yargsWrapper().option({
  maxCommits: {
    alias: 'm',
    describe: 'Maximum number of commits to include, by default this is 100',
    type: 'number',
    default: 100
  }
}).argv;

commandBase(async ({ workingDirectory }) => {
  ConsoleInterface.printLine('Fetching log entries...');
  const entries = await getLog(workingDirectory, args.maxCommits);

  const entriesAsSelectables = entries.map(
    (entry, index) =>
      `${chalk.yellow(entry.shortId)}${
        index === 0 ? chalk.greenBright(' (latest)') : ''
      }: ${entry.message} (${chalk.blueBright(entry.date)})`
  );

  if (entries.length === 0) {
    ConsoleInterface.printLine('No commits found using "git log"', Type.warn);
  }

  let lastSelectedIndex = 0;

  // We want to have a CLI that allows viewing different commits and
  // not exit until the user decides to do so by pressing Ctrl+C.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const selectedIndex = await selectItem(
      entriesAsSelectables,
      'Select a commit to view',
      entriesAsSelectables[lastSelectedIndex]
    );

    lastSelectedIndex = selectedIndex;
    const selectedEntry = entries[selectedIndex];

    await showCommit(workingDirectory, selectedEntry.shortId);
  }
});
