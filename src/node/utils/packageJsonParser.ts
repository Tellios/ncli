import fs from 'fs-extra';
import {resolvePackageJsonFile} from './resolvePackageJsonFile.ts';

export async function parsePackageJson(
  directory: string,
): Promise<NcliNode.IPackageJson> {
  return fs.readJson(resolvePackageJsonFile(directory));
}
