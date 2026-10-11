import {yargsWrapper, commandBase} from '../common/index.ts';
import {createBranch} from './utils/index.ts';

const args = yargsWrapper()
  .option('branch', {
    alias: 'b',
    describe: 'Branch name',
    type: 'string',
    demandOption: true,
  })
  .option('push', {
    alias: 'p',
    describe: 'If the branch should be pushed to the remote',
    type: 'boolean',
    default: false,
  })
  .option('noVerify', {
    alias: 'n',
    describe: 'Add --no-verify to git push command',
    type: 'boolean',
    default: false,
  }).argv;

commandBase(async () => createBranch(args.branch, args.push, args.noVerify));
