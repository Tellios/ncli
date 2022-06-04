import { Options } from 'yargs';
import { yargsWrapper, selectItem, commandBase } from '../common';
import { deleteCommand, listCommand, setCommand } from './subCommands';

const commands: Record<
  string,
  { desc: string; options?: Record<string, Options> }
> = {
  ls: { desc: 'List stored settings for a command' },
  set: { desc: 'Set a setting for a command' },
  delete: { desc: 'Delete a setting for a command' }
};

const yargs = yargsWrapper();

Object.entries(commands).forEach(([cmd, config]) => {
  yargs.command(cmd, config.desc, config.options);
});

const args = yargs.argv;

const runCommandIfMatch = async (cmd: string | number): Promise<boolean> => {
  if (cmd === 'ls') {
    await listCommand();
  } else if (cmd === 'set') {
    await setCommand();
  } else if (cmd === 'delete') {
    await deleteCommand();
  } else {
    return false;
  }

  return true;
};

commandBase(async (): Promise<void> => {
  if (!(await runCommandIfMatch(args._[0]))) {
    const commandEntries = Object.entries(commands);
    const commandTexts = commandEntries.map(
      ([key, config]) => `${key} - ${config.desc}`
    );
    const index = await selectItem(commandTexts, 'Select command to execute');
    const selectedCommand = commandEntries[index][0];
    await runCommandIfMatch(selectedCommand);
  }
});
