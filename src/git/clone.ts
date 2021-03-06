import { spawn } from 'child_process';
import { yargsWrapper, ConsoleInterface, commandBase } from '../common';
import { clone } from './utils';

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

commandBase(({ workingDirectory }) =>
  clone(args.url, args.directory).then((result: string) => {
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
      } catch (e) {
        reject(e);
      }
    });
  })
);
