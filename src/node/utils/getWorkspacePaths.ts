import path from 'node:path';
import glob from 'glob';
import fs from 'fs-extra';
import jsYaml from 'js-yaml';
import {parsePackageJson} from './packageJsonParser.ts';

export type Workspace = {
  name: string;
  relativePath: string;
  absolutePath: string;
};

async function getWorkspacePatterns(
  packageJsonDirectory: string,
  packageJson: NcliNode.IPackageJson,
): Promise<string[]> {
  if (packageJson.workspaces && packageJson.workspaces.length > 0) {
    return packageJson.workspaces;
  }

  const pnpmWorkspaceFile = path.join(
    packageJsonDirectory,
    'pnpm-workspace.yaml',
  );

  if (await fs.pathExists(pnpmWorkspaceFile)) {
    const pnpmWorkspace = jsYaml.safeLoad(
      await fs.readFile(pnpmWorkspaceFile, 'utf8'),
    ) as {packages?: string[]} | undefined;

    return pnpmWorkspace?.packages ?? [];
  }

  return [];
}

export async function getWorkspacePaths(
  packageJsonDirectory: string,
  packageJson: NcliNode.IPackageJson,
): Promise<Workspace[]> {
  const patterns = await getWorkspacePatterns(
    packageJsonDirectory,
    packageJson,
  );
  const includePatterns = patterns.filter((p) => !p.startsWith('!'));
  const ignorePatterns = patterns
    .filter((p) => p.startsWith('!'))
    .map((p) => path.join(p.slice(1), 'package.json'));

  const workspaces: Workspace[] = [];

  for (const workspace of includePatterns) {
    const workspaceMatches = await new Promise<string[]>((resolve, reject) => {
      glob(
        path.join(workspace, 'package.json'),
        {
          cwd: packageJsonDirectory,
          ignore: ['**/node_modules/**', ...ignorePatterns],
        },
        (error, matches) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(matches);
        },
      );
    });

    for (const match of workspaceMatches) {
      const relativePath = path.dirname(match);
      const absolutePath = path.resolve(packageJsonDirectory, relativePath);
      const {name} = await parsePackageJson(absolutePath);

      workspaces.push({
        name: name ?? relativePath,
        relativePath,
        absolutePath,
      });
    }
  }

  return workspaces;
}
