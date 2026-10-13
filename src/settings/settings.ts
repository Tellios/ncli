import { type Options } from 'yargs';
import { yargsWrapper, selectItem, commandBase } from '../common/index.ts';
import {
  deleteCommand,
  listCommand,
  setCommand
} from './sub-commands/index.ts';

const commands: Record<
  string,
  { desc: string; options?: Record<string, Options> }
> = {
  ls: { desc: 'List stored settings for a command' },
  set: { desc: 'Set a setting for a command' },
  delete: { desc: 'Delete a setting for a command' }
};

const yargs = yargsWrapper();

for (const [cmd, config] of Object.entries(commands)) {
  yargs.command(cmd, config.desc, config.options);
}

const args = yargs.argv;

const runCommandIfMatch = async (cmd: string | number): Promise<boolean> => {
  switch (cmd) {
    case 'ls': {
      await listCommand();

      break;
    }

    case 'set': {
      await setCommand();

      break;
    }

    case 'delete': {
      await deleteCommand();

      break;
    }

    default: {
      return false;
    }
  }

  return true;
};

await commandBase(async (): Promise<void> => {
  if (await runCommandIfMatch(args._[0])) {
    return;
  }

  const commandEntries = Object.entries(commands);
  const commandTexts = commandEntries.map(
    ([key, config]) => `${key} - ${config.desc}`
  );
  const index = await selectItem(commandTexts, 'Select command to execute');
  const selectedCommand = commandEntries[index][0];
  await runCommandIfMatch(selectedCommand);
});
