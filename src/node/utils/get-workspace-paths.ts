import path from 'node:path';
import glob from 'glob';
import fs from 'fs-extra';
import jsYaml from 'js-yaml';
import type { PackageJson } from '../types.ts';
import { parsePackageJson } from './package-json-parser.ts';

export type Workspace = {
  name: string;
  relativePath: string;
  absolutePath: string;
};

async function getWorkspacePatterns(
  packageJsonDirectory: string,
  packageJson: PackageJson
): Promise<string[]> {
  if (packageJson.workspaces && packageJson.workspaces.length > 0) {
    return packageJson.workspaces;
  }

  const pnpmWorkspaceFile = path.join(
    packageJsonDirectory,
    'pnpm-workspace.yaml'
  );

  if (await fs.pathExists(pnpmWorkspaceFile)) {
    const pnpmWorkspace = jsYaml.safeLoad(
      await fs.readFile(pnpmWorkspaceFile, 'utf8')
    ) as { packages?: string[] } | undefined;

    return pnpmWorkspace?.packages ?? [];
  }

  return [];
}

export async function getWorkspacePaths(
  packageJsonDirectory: string,
  packageJson: PackageJson
): Promise<Workspace[]> {
  const patterns = await getWorkspacePatterns(
    packageJsonDirectory,
    packageJson
  );
  const includePatterns = patterns.filter((p) => !p.startsWith('!'));
  const ignorePatterns = patterns
    .filter((p) => p.startsWith('!'))
    .map((p) => path.join(p.slice(1), 'package.json'));

  const workspaceMatches = await Promise.all(
    includePatterns.map(
      async (workspace) =>
        new Promise<string[]>((resolve, reject) => {
          glob(
            path.join(workspace, 'package.json'),
            {
              cwd: packageJsonDirectory,
              ignore: ['**/node_modules/**', ...ignorePatterns]
            },
            (error, matches) => {
              if (error) {
                reject(error);
                return;
              }

              resolve(matches);
            }
          );
        })
    )
  );

  return Promise.all(
    workspaceMatches.flat().map(async (match) => {
      const relativePath = path.dirname(match);
      const absolutePath = path.resolve(packageJsonDirectory, relativePath);
      const { name } = await parsePackageJson(absolutePath);

      return {
        name: name ?? relativePath,
        relativePath,
        absolutePath
      };
    })
  );
}
