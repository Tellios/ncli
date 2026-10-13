import {
  ConsoleInterface,
  commandBase,
  confirm,
  yargsWrapper
} from '../common/index.ts';
import {
  deleteBranch,
  getCurrentBranch,
  localizeBranchName,
  selectBranch
} from './utils/index.ts';

const args = yargsWrapper()
  .option('branch', {
    alias: 'b',
    describe: 'Specifies the branch to delete',
    type: 'string'
  })
  .option('push', {
    alias: 'p',
    describe: 'If the delete should be pushed (delete branch on remote)',
    type: 'boolean',
    default: false
  })
  .option('noVerify', {
    alias: 'n',
    describe: 'Add --no-verify to git commit and push commands',
    type: 'boolean',
    default: false
  })
  .option('filter', {
    alias: 'f',
    describe: 'Branch name filter',
    type: 'string'
  })
  .option('force', {
    describe: 'Allows force deleting a branch',
    type: 'boolean',
    default: false
  }).argv;

async function getBranchToDelete(workingDirectory: string): Promise<string> {
  if (args.branch && args.branch.length > 0) {
    return args.branch;
  }

  return selectBranch(
    workingDirectory,
    false,
    'Select branch to DELETE',
    args.filter
  ).then((branch) => localizeBranchName(branch.name));
}

await commandBase(async ({ workingDirectory }) => {
  const branch = await getBranchToDelete(workingDirectory);
  const currentBranch = await getCurrentBranch(workingDirectory);

  if (branch === localizeBranchName(currentBranch.name)) {
    throw new Error(
      "Can't delete the current branch, you need to switch branch first"
    );
  }

  try {
    await deleteBranch(branch, {
      alsoDeleteRemote: args.push,
      noVerify: args.noVerify,
      force: args.force
    });
  } catch (error) {
    ConsoleInterface.printLine('Failed to delete the branch.');

    if (
      await confirm(
        'Branch might not be fully merged. Do you want to force a delete instead?'
      )
    ) {
      return deleteBranch(branch, {
        alsoDeleteRemote: args.push,
        noVerify: args.noVerify,
        force: true
      });
    }

    throw error;
  }
});
