import { Options } from 'yargs';
import { yargsWrapper, selectItem, commandBase } from '../common';
import { IResolveResourceTypeParams, ResourceType } from './utils';
import {
  describeCommand,
  listCommand,
  deleteCommand,
  logCommand,
  contextCommand
} from './subCommands';

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

Object.entries(commands).forEach(([cmd, config]) => {
  yargs.command(cmd, config.desc, config.options);
});

const args = yargs.argv;

const type: IResolveResourceTypeParams = {
  deployment: args.deployment === true,
  pod: args.pod === true,
  service: args.service === true,
  ingress: args.ingress === true
};

const runCommandIfMatch = async (cmd: string | number): Promise<boolean> => {
  if (cmd === 'desc') {
    await describeCommand({ type });
  } else if (cmd === 'ls') {
    await listCommand({ type });
  } else if (cmd === 'del') {
    await deleteCommand({ type });
  } else if (cmd === 'logs') {
    await logCommand({ follow: args.follow === true });
  } else if (cmd === 'ctx') {
    await contextCommand();
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
