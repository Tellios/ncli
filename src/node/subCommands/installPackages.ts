import {runCmdInConsole} from '../../common/index.ts';
import {
  detectPackageManagerOrUseDefault,
  type Workspace,
} from '../utils/index.ts';

export type AutoInstallTypingsMode = 'ignore' | 'installAsDev' | 'install';

export async function installPackages(
  workingDirectory: string,
  packagesToInstall: string[],
  devPackagesToInstall: string[],
  autoInstallTypings: AutoInstallTypingsMode,
  saveExact: boolean,
  workspace: Workspace | undefined,
): Promise<void> {
  switch (await detectPackageManagerOrUseDefault(workingDirectory)) {
    case 'pnpm': {
      const args: string[] = ['add'];
      saveExact && args.push('--save-exact');
      workspace && args.push('--filter', `./${workspace.relativePath}`);

      if (packagesToInstall.length > 0) {
        await runCmdInConsole(
          'pnpm',
          [...args, ...packagesToInstall],
          true,
          workingDirectory,
        );
      }

      if (devPackagesToInstall.length > 0) {
        await runCmdInConsole(
          'pnpm',
          [...args, '-D', ...devPackagesToInstall],
          true,
          workingDirectory,
        );
      }

      break;
    }

    case 'yarn': {
      const args: string[] = workspace ? ['workspace', workspace.name] : [];
      args.push('add');
      saveExact && args.push('--exact');

      if (packagesToInstall.length > 0) {
        await runCmdInConsole(
          'yarn',
          [...args, ...packagesToInstall],
          true,
          workingDirectory,
        );
      }

      if (devPackagesToInstall.length > 0) {
        await runCmdInConsole(
          'yarn',
          [...args, '--dev', ...devPackagesToInstall],
          true,
          workingDirectory,
        );
      }

      break;
    }

    case 'npm': {
      const args: string[] = ['i'];
      saveExact && args.push('--save-exact');
      workspace && args.push('--workspace', workspace.relativePath);

      if (packagesToInstall.length > 0) {
        await runCmdInConsole(
          'npm',
          [...args, ...packagesToInstall],
          true,
          workingDirectory,
        );
      }

      if (devPackagesToInstall.length > 0) {
        await runCmdInConsole(
          'npm',
          [...args, '-D', ...devPackagesToInstall],
          true,
          workingDirectory,
        );
      }

      break;
    }
  }

  const addTypesPrefix = (p: string): string => `@types/${p}`;

  if (autoInstallTypings === 'install') {
    await installPackages(
      workingDirectory,
      [
        ...packagesToInstall.map(addTypesPrefix),
        ...devPackagesToInstall.map(addTypesPrefix),
      ],
      [],
      'ignore',
      saveExact,
      workspace,
    );
  } else if (autoInstallTypings === 'installAsDev') {
    await installPackages(
      workingDirectory,
      [],
      [
        ...packagesToInstall.map(addTypesPrefix),
        ...devPackagesToInstall.map(addTypesPrefix),
      ],
      'ignore',
      saveExact,
      workspace,
    );
  }
}
