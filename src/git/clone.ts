import { spawn } from 'node:child_process';
import {
  yargsWrapper,
  ConsoleInterface,
  commandBase
} from '../common/index.ts';
import { clone } from './utils/index.ts';

const args = yargsWrapper()
  .option('url', {
    alias: 'u',
    describe: 'The url to the repository you want to clone',
    type: 'string',
    demand: true
  })
  .option('directory', {
    alias: 'd',
    describe: 'Optional name for the checkout directory',
    type: 'string'
  })
  .option('code', {
    alias: 'c',
    describe:
      'If you want to start Visual Studio Code for the cloned repository',
    type: 'boolean',
    default: false
  }).argv;

await commandBase(async ({ workingDirectory }) =>
  clone(args.url, args.directory).then(async (result: string) => {
    ConsoleInterface.printLine('Repository cloned');

    return new Promise((resolve, reject) => {
      try {
        if (args.code) {
          spawn('code', [result], {
            cwd: workingDirectory,
            detached: true,
            stdio: 'ignore',
            shell: true
          });
        }

        resolve();
      } catch (error) {
        if (error instanceof Error) {
          reject(error);
        } else {
          reject(new Error(String(error)));
        }
      }
    });
  })
);
