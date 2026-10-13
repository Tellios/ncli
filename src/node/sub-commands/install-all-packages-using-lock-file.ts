import { runCmdInConsole, selectItem } from '../../common/index.ts';
import { detectPackageManager, type PackageManager } from '../utils/index.ts';

export async function installAllPackagesUsingLockFile(
  workingDirectory: string
): Promise<void> {
  switch (await detectPackageManager(workingDirectory)) {
    case 'pnpm': {
      await runCmdInConsole(
        'pnpm',
        ['install', '--frozen-lockfile'],
        true,
        workingDirectory
      );
      break;
    }

    case 'yarn': {
      await runCmdInConsole('yarn', [], true, workingDirectory);
      break;
    }

    case 'npm': {
      await runCmdInConsole('npm', ['ci'], true, workingDirectory);
      break;
    }

    case undefined: {
      const options: Array<[string, PackageManager | undefined]> = [
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
