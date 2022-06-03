import * as process from 'process';
import { ConsoleInterface, Type } from '../common';
import {
  executeMatchingAlias,
  generateAliasFile,
  listAliases,
  selectAliasAndExecute
} from './subCommands';

const [command, ...args] = process.argv.slice(2);

if (command === 'run' && args.length === 0) {
  selectAliasAndExecute();
} else if (command === 'run') {
  executeMatchingAlias(args);
} else if (command === 'list') {
  listAliases();
} else if (command === 'generate') {
  generateAliasFile();
} else {
  ConsoleInterface.printLine(
    `No command specified, available commands: run, list, generate`,
    Type.error
  );
}
