import { yargsWrapper, ConsoleInterface, commandBase } from '../common';
import { parsePackageJson } from './utils';
import {
  installAllPackagesUsingLockFile,
  uninstallPackages,
  installPackages,
  AutoInstallTypingsMode,
  updatePackages
} from './subCommands';

commandBase<'ni'>(async ({ workingDirectory, settings }) => {
  const args = yargsWrapper(false)
    .command('add', 'Install one or more packages', {
      dev: {
        alias: 'd',
        desc: 'All packages after dev will be installed as dev packages'
      },
      'auto-types': {
        alias: 'a',
        desc: [
          'Automatically install @types packages for the packages being installed. ',
          'If autoTypes is provided after the dev flag, ',
          'they will be installed as dev packages'
        ].join('')
      },
      saveExact: {
        desc: 'Packages will be installed with exact versioning',
        type: 'boolean',
        default: settings.saveExact ?? false
      }
    })
    .command('del', 'Uninstall one or more packages')
    .command(
      'update',
      'Update one or more packages to the latest version. Packages will be specified using a multiselect list.',
      {
        saveExact: {
          desc: 'Packages will be installed with exact versioning',
          type: 'boolean',
          default: settings.saveExact ?? false
        }
      }
    ).argv;

  const packageJson = await parsePackageJson(workingDirectory);

  if (args._[0] === 'add') {
    const addArgs = process.argv.slice(3);
    const packagesToInstall: string[] = [];
    const devPackagesToInstall: string[] = [];
    let devFlag = false;
    let typingsMode: AutoInstallTypingsMode = 'ignore';

    addArgs.forEach((addArg) => {
      if (addArg === '-da') {
        devFlag = true;
        typingsMode = 'installAsDev';
      } else if (addArg === '-ad') {
        devFlag = true;
        typingsMode = 'install';
      } else if (addArg === '--dev' || addArg === '-d') {
        devFlag = true;
      } else if (addArg === '--auto-types' || addArg === '-a') {
        typingsMode = devFlag ? 'installAsDev' : 'install';
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
      (args as unknown as { saveExact: boolean }).saveExact
    );
  } else if (args._[0] === 'del') {
    return await uninstallPackages(
      workingDirectory,
      packageJson,
      args._[1]?.toString()
    );
  } else if (args._[0] === 'update') {
    return await updatePackages(
      workingDirectory,
      packageJson,
      (args as unknown as { saveExact: boolean }).saveExact,
      args._[1]?.toString()
    );
  } else if (args._.length > 0) {
    ConsoleInterface.printLine('Unknown command');
  } else {
    await installAllPackagesUsingLockFile(workingDirectory);
  }
});
