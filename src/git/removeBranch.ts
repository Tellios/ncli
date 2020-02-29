import { yargsWrapper, commandBase } from '../common';
import {
    selectBranch,
    localizeBranchName,
    getCurrentBranch,
    deleteBranch
} from './utils';

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
    .option('filter', {
        alias: 'f',
        describe: 'Branch name filter',
        type: 'string'
    }).argv;

function getBranchToDelete(workingDirectory: string) {
    if (args.branch && args.branch.length > 0) {
        return Promise.resolve(args.branch);
    }

    return selectBranch(
        workingDirectory,
        false,
        'Select branch to DELETE',
        args.filter
    ).then(branch => {
        return localizeBranchName(branch.name);
    });
}

commandBase(async (workingDirectory: string) => {
    const branch = await getBranchToDelete(workingDirectory);
    const currentBranch = await getCurrentBranch(workingDirectory);

    if (branch === localizeBranchName(currentBranch.name)) {
        throw new Error(
            "Can't delete the current branch, you need to switch branch first"
        );
    }

    await deleteBranch(branch, args.push);
});
