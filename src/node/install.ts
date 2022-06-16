import { yargsWrapper, ConsoleInterface, commandBase } from '../common';
import { parsePackageJson, selectWorkspace, Workspace } from './utils';
import {
  installAllPackagesUsingLockFile,
  uninstallPackages,
  installPackages,
  AutoInstallTypingsMode,
  updatePackages
} from './subCommands';

commandBase<'ni'>(
  async ({ workingDirectory, settings, setSetting, getSettings }) => {
    const args = yargsWrapper(false)
      .command('add', 'Install one or more packages', {
        dev: {
          alias: 'd',
          desc: 'All packages after dev will be installed as dev packages',
          type: 'boolean'
        },
        'auto-types': {
          alias: 'a',
          type: 'boolean',
          desc: [
            'Automatically install @types packages for the packages being installed. ',
            'If autoTypes is provided after the dev flag, ',
            'they will be installed as dev packages'
          ].join('')
        },
        saveExact: {
          alias: 'e',
          desc: 'Packages will be installed with exact versioning',
          type: 'boolean',
          default: settings.saveExact ?? false
        },
        workspace: {
          type: 'boolean',
          alias: 'w',
          desc: 'If the installation should be performed in a workspace package instead'
        }
      })
      .command('del', 'Uninstall one or more packages', {
        workspace: {
          type: 'boolean',
          alias: 'w',
          desc: 'If the uninstall should be performed in a workspace package instead'
        }
      })
      .command(
        'update',
        'Update one or more packages to the latest version. Packages will be specified using a multiselect list.',
        {
          saveExact: {
            alias: 'e',
            desc: 'Packages will be installed with exact versioning',
            type: 'boolean',
            default: settings.saveExact ?? false
          },
          workspace: {
            type: 'boolean',
            alias: 'w',
            desc: 'If the updates should be performed in a workspace package instead'
          }
        }
      ).argv;

    let packageJson = await parsePackageJson(workingDirectory);

    const flags = args as unknown as {
      saveExact: boolean;
      workspace: boolean | undefined;
    };

    let workspace: Workspace | undefined;

    if (flags.workspace) {
      workspace = await selectWorkspace(
        workingDirectory,
        packageJson,
        settings.lastSelectedWorkspace
      );

      await setSetting('lastSelectedWorkspace', workspace.relativePath);
      settings = await getSettings(workspace.absolutePath);
      packageJson = await parsePackageJson(workspace.absolutePath);
    }

    if (args._[0] === 'add') {
      const addArgs = process.argv.slice(3);
      const packagesToInstall: string[] = [];
      const devPackagesToInstall: string[] = [];
      let devFlag = false;
      let typingsMode: AutoInstallTypingsMode = 'ignore';

      addArgs.forEach((addArg) => {
        console.log(addArg);
        if (addArg === '--dev' || addArg === '-d') {
          devFlag = true;
        } else if (addArg === '--auto-types' || addArg === '-a') {
          typingsMode = devFlag ? 'installAsDev' : 'install';
        } else if (addArg.startsWith('-')) {
          if (addArg.startsWith('--')) {
            return;
          }

          const autoTypesIndex = addArg.indexOf('a');
          const devIndex = addArg.indexOf('d');

          if (devIndex < autoTypesIndex) {
            // -da
            devFlag = true;
            typingsMode = 'installAsDev';
          } else if (autoTypesIndex < devIndex) {
            // -ad
            devFlag = true;
            typingsMode = 'install';
          }
        } else if (devFlag) {
          devPackagesToInstall.push(addArg);
        } else {
          packagesToInstall.push(addArg);
        }
      });

      return await installPackages(
        workingDirectory,
        packagesToInstall,
        devPackagesToInstall,
        typingsMode,
        flags.saveExact,
        workspace?.relativePath
      );
    } else if (args._[0] === 'del') {
      return await uninstallPackages(
        workingDirectory,
        packageJson,
        args._[1]?.toString(),
        workspace?.relativePath
      );
    } else if (args._[0] === 'update') {
      return await updatePackages(
        workingDirectory,
        packageJson,
        flags.saveExact,
        args._[1]?.toString(),
        workspace?.relativePath
      );
    } else if (args._.length > 0) {
      ConsoleInterface.printLine('Unknown command');
    } else {
      await installAllPackagesUsingLockFile(workingDirectory);
    }
  }
);
