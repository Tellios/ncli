import fs from 'fs-extra';
import type { PackageJson } from '../types.ts';
import { resolvePackageJsonFile } from './resolve-package-json-file.ts';

export async function parsePackageJson(
  directory: string
): Promise<PackageJson> {
  return fs.readJson(resolvePackageJsonFile(directory)) as Promise<PackageJson>;
}
