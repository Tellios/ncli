import {
  yargsWrapper,
  ConsoleInterface,
  commandBase
} from '../common/index.ts';
import { branchNameColoring, getBranches } from './utils/index.ts';

const args = yargsWrapper()
  .option('remote', {
    alias: 'r',
    describe: 'Include remote branches',
    type: 'boolean',
    default: false
  })
  .option('filter', {
    alias: 'f',
    describe: 'Branch name filter',
    type: 'string'
  }).argv;

await commandBase(async ({ workingDirectory }) => {
  const branches = await getBranches(workingDirectory, args.remote);
  ConsoleInterface.printLines(branchNameColoring(branches));
});
