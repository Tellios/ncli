import fs from 'fs-extra';
import {resolvePackageJsonFile} from './resolve-package-json-file.ts';

export async function updatePackageJson(
  directory: string,
  newPackageJson: NcliNode.PackageJson,
): Promise<void> {
  const packageJsonFile = resolvePackageJsonFile(directory);

  if (fs.existsSync(packageJsonFile)) {
    await fs.writeJson(packageJsonFile, newPackageJson, {
      spaces: 2,
    });
  } else {
    throw new Error(`package.json not found in '${directory}'`);
  }
}
