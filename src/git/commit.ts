import { yargsWrapper, commandBase } from '../common';
import { getStatus, addAll, commit } from './utils';

commandBase<'ncommit'>(async ({ workingDirectory, settings }) => {
  const args = yargsWrapper()
    .epilogue('ncommit makes doing git commit less tedious')
    .option('addAll', {
      alias: 'a',
      describe: 'Stage all git changes (git add .) before commit',
      type: 'boolean',
      default: settings.addAll ?? false
    })
    .option('message', {
      alias: 'm',
      describe:
        'Commit message. If you are using edit, message is optional. Not supplying a message will automatically supply --no-edit to the git commit command.',
      type: 'string',
      demandOption: false
    })
    .option('push', {
      alias: 'p',
      describe: 'Push to remote after commiting',
      type: 'boolean',
      default: settings.push ?? false
    })
    .option('force', {
      alias: 'f',
      describe: 'If --force should be used when pushing to remote',
      type: 'boolean',
      default: settings.force ?? false
    })
    .option('noVerify', {
      alias: 'n',
      describe: 'Add --no-verify to git commit and push commands',
      type: 'boolean',
      default: settings.noVerify ?? false
    })
    .option('tags', {
      alias: 't',
      describe: 'Also push all tags',
      type: 'boolean',
      default: settings.tags ?? false
    })
    .option('edit', {
      alias: 'e',
      describe: 'Edit the previous commit (git commit --amend)',
      type: 'boolean',
      default: false
    }).argv;

  if (!args.edit && !args.message) {
    throw new Error(`'message' is required when 'edit' is not used`);
  }

  const status = await getStatus(workingDirectory);

  if (status.hasChanges) {
    if (args.addAll) {
      await addAll(workingDirectory);
    }

    await commit(
      workingDirectory,
      args.message,
      args.push,
      args.noVerify,
      args.tags,
      args.edit,
      args.force
    );
  } else {
    throw new Error('Nothing to commit');
  }
});
