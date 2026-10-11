import process from 'node:process';
import {ConsoleInterface, Type} from '../common/index.ts';
import {
  executeMatchingAlias,
  generateAliasFile,
  listAliases,
  selectAliasAndExecute,
} from './sub-commands/index.ts';

const [command, ...args] = process.argv.slice(2);

if (command === 'run' && args.length === 0) {
  selectAliasAndExecute();
} else {
  switch (command) {
    case 'run': {
      executeMatchingAlias(args);

      break;
    }

    case 'list': {
      listAliases();

      break;
    }

    case 'generate': {
      generateAliasFile();

      break;
    }

    default: {
      ConsoleInterface.printLine(
        'No command specified, available commands: run, list, generate',
        Type.error,
      );
    }
  }
}
