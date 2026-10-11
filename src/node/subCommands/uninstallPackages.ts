import {runCmdInConsole} from '../../common/index.ts';
import {
  detectPackageManagerOrUseDefault,
  type Workspace,
} from '../utils/index.ts';
import {selectPackages} from './selectPackages.ts';

export async function uninstallPackages(
  workingDirectory: string,
  packageJson: NcliNode.IPackageJson,
  searchString: string | undefined,
  workspace: Workspace | undefined,
): Promise<void> {
  const packages = await selectPackages(packageJson, searchString);
  const packageNames = packages.map((p) => p.name);

  switch (await detectPackageManagerOrUseDefault(workingDirectory)) {
    case 'pnpm': {
      const args = ['remove'];
      workspace && args.push('--filter', `./${workspace.relativePath}`);
      args.push(...packageNames);

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
      const args = ['uninstall'];
      workspace && args.push('--workspace', workspace.relativePath);
      args.push(...packageNames);

      await runCmdInConsole('npm', args, true, workingDirectory);
      break;
    }
  }
}
