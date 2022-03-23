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
        'Commit message, if you are using amend message is optional. Not supplying a message will automatically supply --no-edit to the git commit command.',
      type: 'string',
      demandOption: false
    })
    .option('push', {
      alias: 'p',
      describe: 'Push to remote after commiting',
      type: 'boolean',
      default: settings.push ?? false
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
    .option('amend', {
      describe: 'Amend the previous commit',
      type: 'boolean',
      default: false
    }).argv;

  if (!args.amend && !args.message) {
    throw new Error(`'message' is required when 'amend' is not used`);
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
      args.amend
    );
  } else {
    throw new Error('Nothing to commit');
  }
});
