import fs from 'fs-extra';
import {resolvePackageJsonFile} from './resolve-package-json-file.ts';

export async function parsePackageJson(
  directory: string,
): Promise<NcliNode.PackageJson> {
  return fs.readJson(resolvePackageJsonFile(directory));
}
