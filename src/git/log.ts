import { styleText } from 'node:util';
import {
  ConsoleInterface,
  Type,
  commandBase,
  selectItem,
  yargsWrapper
} from '../common/index.ts';
import { getLog, showCommit } from './utils/index.ts';

const args = yargsWrapper()
  .option({
    maxCommits: {
      alias: 'm',
      describe: 'Maximum number of commits to include, by default this is 100',
      type: 'number',
      default: 100
    }
  })
  .parseSync();

await commandBase(async ({ workingDirectory }) => {
  ConsoleInterface.printLine('Fetching log entries...');
  const entries = await getLog(workingDirectory, args.maxCommits);

  const entriesAsSelectables = entries.map(
    (entry, index) =>
      `${styleText('yellow', entry.shortId)}${
        index === 0 ? styleText('greenBright', ' (latest)') : ''
      }: ${entry.message} (${styleText('blueBright', entry.date)})`
  );

  if (entries.length === 0) {
    ConsoleInterface.printLine('No commits found using "git log"', Type.warn);
  }

  let lastSelectedIndex = 0;

  // We want to have a CLI that allows viewing different commits and
  // not exit until the user decides to do so by pressing Ctrl+C.

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
