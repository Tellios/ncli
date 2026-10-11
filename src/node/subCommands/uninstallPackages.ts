import { runCmdInConsole } from '../../common';
import { selectPackages } from './selectPackages';
import { detectPackageManagerOrUseDefault, Workspace } from '../utils';

export async function uninstallPackages(
  workingDirectory: string,
  packageJson: NcliNode.IPackageJson,
  searchString: string | undefined,
  workspace: Workspace | undefined
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
