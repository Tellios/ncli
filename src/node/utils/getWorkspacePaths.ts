import * as path from 'path';
import * as glob from 'glob';

export interface Workspace {
  relativePath: string;
  absolutePath: string;
}

export async function getWorkspacePaths(
  packageJsonDirectory: string,
  packageJson: NcliNode.IPackageJson
): Promise<Workspace[]> {
  if (!packageJson.workspaces || packageJson.workspaces.length === 0) {
    return [];
  }

  const workspaces: Workspace[] = [];

  for await (const workspace of packageJson.workspaces) {
    const workspacesMatches = await new Promise<Workspace[]>(
      (resolve, reject) => {
        glob(
          path.join(workspace, 'package.json'),
          { root: packageJsonDirectory },
          (err, matches) => {
            if (err) {
              return reject(err);
            }

            return resolve(
              matches.map((match) => {
                const dirname = path.dirname(match);

                return {
                  relativePath: dirname,
                  absolutePath: path.resolve(packageJsonDirectory, dirname)
                };
              })
            );
          }
        );
      }
    );

    workspacesMatches.forEach((w) => {
      workspaces.push(w);
    });
  }

  return workspaces;
}
