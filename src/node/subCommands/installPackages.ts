import { runCmdInConsole, ConsoleInterface } from '../../common';
import { containsYarnLockFile, containsPackageLockFile } from '../utils';

export type AutoInstallTypingsMode = 'ignore' | 'installAsDev' | 'install';

export async function installPackages(
  workingDirectory: string,
  packagesToInstall: string[],
  devPackagesToInstall: string[],
  autoInstallTypings: AutoInstallTypingsMode,
  saveExact: boolean,
  workspace: string | undefined
): Promise<void> {
  console.log('deps', packagesToInstall, 'dev deps', devPackagesToInstall);

  if (await containsYarnLockFile(workingDirectory)) {
    const args: string[] = ['add'];
    saveExact && args.push('--exact');

    if (packagesToInstall.length > 0) {
      await runCmdInConsole('yarn', [...args, ...packagesToInstall]);
    }

    if (devPackagesToInstall.length > 0) {
      await runCmdInConsole('yarn', [
        ...args,
        '--dev',
        ...devPackagesToInstall
      ]);
    }
  } else if (await containsPackageLockFile(workingDirectory)) {
    const args: string[] = ['i'];
    saveExact && args.push('--save-exact');
    workspace && args.push('--workspace', workspace);

    if (packagesToInstall.length > 0) {
      await runCmdInConsole('npm', [...args, ...packagesToInstall]);
    }

    if (devPackagesToInstall.length > 0) {
      await runCmdInConsole('npm', [...args, '-D', ...devPackagesToInstall]);
    }
  } else {
    ConsoleInterface.printLine('No yarn or npm lock file found');
    return;
  }

  const addTypesPrefix = (p: string): string => `@types/${p}`;

  if (autoInstallTypings === 'install') {
    await installPackages(
      workingDirectory,
      [
        ...packagesToInstall.map(addTypesPrefix),
        ...devPackagesToInstall.map(addTypesPrefix)
      ],
      [],
      'ignore',
      saveExact,
      workspace
    );
  } else if (autoInstallTypings === 'installAsDev') {
    await installPackages(
      workingDirectory,
      [],
      [
        ...packagesToInstall.map(addTypesPrefix),
        ...devPackagesToInstall.map(addTypesPrefix)
      ],
      'ignore',
      saveExact,
      workspace
    );
  }
}
