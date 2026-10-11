import { runCmdInConsole, selectItem } from '../../common';
import { detectPackageManager, PackageManager } from '../utils';

export async function installAllPackagesUsingLockFile(
  workingDirectory: string
): Promise<void> {
  switch (await detectPackageManager(workingDirectory)) {
    case 'pnpm':
      await runCmdInConsole(
        'pnpm',
        ['install', '--frozen-lockfile'],
        true,
        workingDirectory
      );
      break;
    case 'yarn':
      await runCmdInConsole('yarn', [], true, workingDirectory);
      break;
    case 'npm':
      await runCmdInConsole('npm', ['ci'], true, workingDirectory);
      break;
    default: {
      const options: [string, PackageManager | undefined][] = [
        ['NPM', 'npm'],
        ['Yarn', 'yarn'],
        ['PNPM', 'pnpm'],
        ['Do nothing', undefined]
      ];
      const [, packageManager] =
        options[
          await selectItem(
            options.map(([label]) => label),
            'No lock file found. Install packages using'
          )
        ];

      if (packageManager) {
        await runCmdInConsole(
          packageManager,
          ['install'],
          true,
          workingDirectory
        );
      }
    }
  }
}
