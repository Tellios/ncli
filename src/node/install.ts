import process from 'node:process';
import {
  yargsWrapper,
  ConsoleInterface,
  commandBase
} from '../common/index.ts';
import {
  parsePackageJson,
  selectWorkspace,
  type Workspace
} from './utils/index.ts';
import {
  installAllPackagesUsingLockFile,
  uninstallPackages,
  installPackages,
  type AutoInstallTypingsMode,
  updatePackages
} from './sub-commands/index.ts';

await commandBase<'ni'>(
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
      )
      .parseSync();

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
      const argsForAdd = process.argv.slice(3);
      const packagesToInstall: string[] = [];
      const devPackagesToInstall: string[] = [];
      let isDevFlag = false;
      let typingsMode: AutoInstallTypingsMode = 'ignore';

      for (const argAdd of argsForAdd) {
        if (argAdd === '--dev' || argAdd === '-d') {
          isDevFlag = true;
        } else if (argAdd === '--auto-types' || argAdd === '-a') {
          typingsMode = isDevFlag ? 'installAsDev' : 'install';
        } else if (argAdd.startsWith('-')) {
          if (argAdd.startsWith('--')) {
            continue;
          }

          const autoTypesIndex = argAdd.indexOf('a');
          const devIndex = argAdd.indexOf('d');

          if (devIndex < autoTypesIndex) {
            // -da
            isDevFlag = true;
            typingsMode = 'installAsDev';
          } else if (autoTypesIndex < devIndex) {
            // -ad
            isDevFlag = true;
            typingsMode = 'install';
          }
        } else if (isDevFlag) {
          devPackagesToInstall.push(argAdd);
        } else {
          packagesToInstall.push(argAdd);
        }
      }

      return installPackages(
        workingDirectory,
        packagesToInstall,
        devPackagesToInstall,
        typingsMode,
        flags.saveExact,
        workspace
      );
    }

    if (args._[0] === 'del') {
      return uninstallPackages(
        workingDirectory,
        packageJson,
        args._[1]?.toString(),
        workspace
      );
    }

    if (args._[0] === 'update') {
      return updatePackages(
        workingDirectory,
        packageJson,
        flags.saveExact,
        args._[1]?.toString(),
        workspace
      );
    }

    if (args._.length > 0) {
      ConsoleInterface.printLine('Unknown command');
    } else {
      await installAllPackagesUsingLockFile(workingDirectory);
    }
  }
);
