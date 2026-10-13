import { commandBase, yargsWrapper } from '../common/index.ts';
import { push } from './utils/index.ts';

await commandBase<'npush'>(async ({ workingDirectory, settings }) => {
  const args = yargsWrapper()
    .option('noVerify', {
      alias: 'n',
      describe: 'Add --no-verify to git push command',
      type: 'boolean',
      default: settings.noVerify ?? false
    })
    .option('tags', {
      alias: 't',
      describe: 'Also push all tags',
      type: 'boolean',
      default: settings.tags ?? false
    })
    .option('force', {
      alias: 'f',
      describe: 'If --force should be used when pushing to remote',
      type: 'boolean',
      default: false
    })
    .parseSync();

  await push(workingDirectory, args.noVerify, args.tags, args.force);
});
