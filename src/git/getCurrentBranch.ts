import { ConsoleInterface, Type, commandBase } from '../common';
import { getCurrentBranch, IBranch } from './utils';

commandBase(async workingDirectory => {
    const branch = await getCurrentBranch(workingDirectory);

    if (branch) {
        ConsoleInterface.printLine(branch.name);
    } else {
        ConsoleInterface.printLine(
            'Unable to determine current branch from working directory',
            Type.error
        );
    }
});
