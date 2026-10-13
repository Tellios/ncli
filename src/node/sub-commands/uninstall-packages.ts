import { runCmdInConsole } from '../../common/index.ts';
import {
  detectPackageManagerOrUseDefault,
  type Workspace
} from '../utils/index.ts';
import type { PackageJson } from '../types.ts';
import { selectPackages } from './select-packages.ts';

export async function uninstallPackages(
  workingDirectory: string,
  packageJson: PackageJson,
  searchString: string | undefined,
  workspace: Workspace | undefined
): Promise<void> {
  const packages = await selectPackages(packageJson, searchString);
  const packageNames = packages.map((p) => p.name);

  switch (await detectPackageManagerOrUseDefault(workingDirectory)) {
    case 'pnpm': {
      const args = [
        'remove',
        ...(workspace ? ['--filter', `./${workspace.relativePath}`] : []),
        ...packageNames
      ];

      await runCmdInConsole('pnpm', args, true, workingDirectory);
      break;
    }

    case 'yarn': {
      const args = workspace ? ['workspace', workspace.name] : [];
      args.push('remove', ...packageNames);

      await runCmdInConsole('yarn', args, true, workingDirectory);
      break;
    }

    case 'npm': {
      const args = [
        'uninstall',
        ...(workspace ? ['--workspace', workspace.relativePath] : []),
        ...packageNames
      ];

      await runCmdInConsole('npm', args, true, workingDirectory);
      break;
    }
  }
}
