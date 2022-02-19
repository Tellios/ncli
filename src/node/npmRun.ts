import { exit } from 'process';
import {
  yargsWrapper,
  commandBase,
  ConsoleInterface,
  selectItem
} from '../common';
import {
  parsePackageJson,
  executePackageJsonScript,
  selectScript,
  getWorkspaces,
  Workspace
} from './utils';
import {
  listPackageJsonScripts,
  addPackageJsonScript,
  deletePackageJsonScript,
  editPackageJsonScript,
  runScripts,
  selectScripts
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
  .option('async', {
    describe: 'Select multiple NPM scripts to run concurrently'
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
  })
  .option('workspace', {
    alias: 'w',
    describe:
      'If the script should be executed inside a workspace project instead',
    boolean: true
  }).argv;

commandBase<'nr'>(
  async ({ workingDirectory, settings, setSetting, getSettings }) => {
    let packageJson = await parsePackageJson(workingDirectory);
    let workspace: Workspace | undefined;

    if (args.workspace) {
      if (packageJson.workspaces && packageJson.workspaces.length > 0) {
        const workspaces = await getWorkspaces(workingDirectory, packageJson);
        workspace =
          workspaces[
            await selectItem(
              workspaces.map((p) => p.relativePath),
              'Select workspace to execute the script for',
              settings.lastSelectedWorkspace
            )
          ];

        packageJson = await parsePackageJson(workspace.absolutePath);
        workingDirectory = workspace.absolutePath;
        await setSetting('lastSelectedWorkspace', workspace.relativePath);
        settings = await getSettings(workspace.absolutePath);
      } else {
        ConsoleInterface.printLine(
          'Workspaces are not configured for this project'
        );
        exit(1);
      }
    }

    if (args.list) {
      listPackageJsonScripts(packageJson.scripts);
    } else if (args.add) {
      await addPackageJsonScript(workingDirectory, packageJson);
    } else if (args.edit) {
      await editPackageJsonScript(workingDirectory, packageJson);
    } else if (args.delete) {
      await deletePackageJsonScript(workingDirectory, packageJson);
    } else if (args.async) {
      await selectScripts(packageJson, workingDirectory);
    } else if (args._ && args._.length > 0) {
      await runScripts(
        args._.map((a) => a.toString()),
        packageJson,
        workingDirectory
      );
    } else {
      const selectedScript = await selectScript(
        packageJson.scripts,
        settings.lastExecutedScript
      );
      await setSetting(
        'lastExecutedScript',
        selectedScript,
        workspace?.absolutePath
      );

      await executePackageJsonScript(
        selectedScript,
        packageJson.scripts,
        workingDirectory
      );
    }
  }
);
