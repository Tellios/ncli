import { commandBase } from '../base';
import { yargsWrapper } from '../../src/utils';
import {
    parsePackageJson,
    executePackageJsonScript,
    selectScript
} from '../../src/node';
import {
    listPackageJsonScripts,
    addPackageJsonScript,
    deletePackageJsonScript,
    editPackageJsonScript
} from './subCommands';

const args = yargsWrapper()
    .option('list', {
        alias: 'l',
        describe: 'Lists the available NPM scripts',
        type: 'boolean'
    })
    .option('add', {
        alias: 'a',
        describe: 'Add a new NPM script',
        type: 'boolean'
    })
    .option('edit', {
        alias: 'e',
        describe: 'Edit an existing NPM script',
        type: 'boolean'
    })
    .option('delete', {
        alias: 'd',
        describe: 'Delete an existing NPM script',
        type: 'boolean'
    }).argv;

commandBase(async (workingDirectory: string): Promise<any> => {
    const packageJson = await parsePackageJson(workingDirectory);

    if (args.list) {
        listPackageJsonScripts(packageJson.scripts);
    } else if (args.add) {
        await addPackageJsonScript(workingDirectory, packageJson);
    } else if (args.edit) {
        await editPackageJsonScript(workingDirectory, packageJson);
    } else if (args.delete) {
        await deletePackageJsonScript(workingDirectory, packageJson);
    } else if (args._ && args._.length > 0) {
        const script = args._[0];
        await executePackageJsonScript(script, packageJson.scripts);
    } else {
        const selectedScript = await selectScript(packageJson.scripts);
        await executePackageJsonScript(selectedScript, packageJson.scripts);
    }
});
