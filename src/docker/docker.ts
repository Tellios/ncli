import { type Options } from 'yargs';
import { yargsWrapper, selectItem, commandBase } from '../common/index.ts';
import {
  deleteCommand,
  listCommand,
  logCommand,
  startCommand,
  stopCommand,
  inspectCommand
} from './sub-commands/index.ts';

const commands: Record<
  string,
  { desc: string; options?: Record<string, Options> }
> = {
  inspect: {
    desc: 'Inspect a resource',
    options: {
      running: {
        alias: 'r',
        describe: 'Only display running containers',
        type: 'boolean',
        default: false
      }
    }
  },
  ls: {
    desc: 'List resources',
    options: {
      running: {
        alias: 'r',
        describe: 'Only display running containers',
        type: 'boolean'
      }
    }
  },
  del: {
    desc: 'Delete resources',
    options: {
      running: {
        alias: 'r',
        describe: 'Only display running containers',
        type: 'boolean',
        default: false
      },
      force: {
        alias: 'f',
        describe: 'Remove container even if it is running',
        type: 'boolean',
        default: false
      }
    }
  },
  start: { desc: 'Start a container' },
  stop: { desc: 'Stop a container' },
  logs: {
    desc: 'Print logs for a container',
    options: {
      running: {
        alias: 'r',
        describe: 'Only display running containers',
        type: 'boolean',
        default: false
      },
      follow: {
        alias: 'f',
        boolean: true,
        desc: 'If logs should be streamed',
        default: false
      }
    }
  }
};

const yargs = yargsWrapper();

for (const [cmd, config] of Object.entries(commands)) {
  yargs.command(cmd, config.desc, config.options);
}

const args = yargs.parseSync();

const runCommandIfMatch = async (cmd: string): Promise<boolean> => {
  switch (cmd) {
    case 'inspect': {
      await inspectCommand({ onlyShowRunning: args.running === true });

      break;
    }

    case 'ls': {
      await listCommand({ onlyShowRunning: args.running === true });

      break;
    }

    case 'del': {
      await deleteCommand({
        onlyShowRunning: args.running === true,
        forcefullyDelete: args.force === true
      });

      break;
    }

    case 'start': {
      await startCommand();

      break;
    }

    case 'stop': {
      await stopCommand();

      break;
    }

    case 'logs': {
      await logCommand({
        onlyShowRunning: args.running === true,
        follow: args.follow === true
      });

      break;
    }

    default: {
      return false;
    }
  }

  return true;
};

await commandBase(async (): Promise<void> => {
  if (await runCommandIfMatch(args._[0] as string)) {
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
