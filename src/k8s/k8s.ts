import { type Options } from 'yargs';
import { yargsWrapper, selectItem, commandBase } from '../common/index.ts';
import {
  type ResolveResourceTypeParameters,
  type ResourceType
} from './utils/index.ts';
import {
  describeCommand,
  listCommand,
  deleteCommand,
  logCommand,
  contextCommand
} from './sub-commands/index.ts';

const selectResourceArgs: Record<ResourceType, Options> = {
  deployment: {
    alias: 'd',
    desc: 'Quick select deployment(s) as target for the command'
  },
  pod: {
    alias: 'p',
    desc: 'Quick select pod(s) as target for the command'
  },
  service: {
    alias: 's',
    desc: 'Quick select service(s) as target for the command'
  },
  ingress: {
    alias: 'i',
    desc: 'Quick select ingress(es) as target for the command'
  }
};

const commands: Record<
  string,
  { desc: string; options?: Record<string, Options> }
> = {
  desc: { desc: 'Describe a k8s resource', options: selectResourceArgs },
  ls: { desc: 'List k8s resources', options: selectResourceArgs },
  del: { desc: 'Delete a k8s resource', options: selectResourceArgs },
  logs: {
    desc: 'Print logs for a pod',
    options: {
      follow: {
        alias: 'f',
        desc: 'If logs should be streamed'
      }
    }
  },
  ctx: { desc: 'Switch k8s context' }
};

const yargs = yargsWrapper();

for (const [cmd, config] of Object.entries(commands)) {
  yargs.command(cmd, config.desc, config.options);
}

const args = yargs.argv;

const type: ResolveResourceTypeParameters = {
  deployment: args.deployment === true,
  pod: args.pod === true,
  service: args.service === true,
  ingress: args.ingress === true
};

const willRunCommandIfMatch = async (
  cmd: string | number
): Promise<boolean> => {
  switch (cmd) {
    case 'desc': {
      await describeCommand({ type });

      break;
    }

    case 'ls': {
      await listCommand({ type });

      break;
    }

    case 'del': {
      await deleteCommand({ type });

      break;
    }

    case 'logs': {
      await logCommand({ follow: args.follow === true });

      break;
    }

    case 'ctx': {
      await contextCommand();

      break;
    }

    default: {
      return false;
    }
  }

  return true;
};

await commandBase(async (): Promise<void> => {
  if (await willRunCommandIfMatch(args._[0])) {
    return;
  }

  const commandEntries = Object.entries(commands);
  const commandTexts = commandEntries.map(
    ([key, config]) => `${key} - ${config.desc}`
  );
  const index = await selectItem(commandTexts, 'Select command to execute');
  const selectedCommand = commandEntries[index][0];
  await willRunCommandIfMatch(selectedCommand);
});
