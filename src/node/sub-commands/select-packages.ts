import chalk from 'chalk';
import { selectItems } from '../../common/index.ts';
import type { Package, PackageJson } from '../types.ts';

export async function selectPackages(
  packageJson: PackageJson,
  searchString?: string
): Promise<Package[]> {
  const packages: Package[] = [
    ...Object.keys(packageJson.dependencies || {}).map((name): Package => {
      const version = packageJson.dependencies[name];
      const label = `${chalk.cyan(name)} - ${version}`;

      return {
        dev: false,
        name,
        version,
        label
      };
    }),
    ...Object.keys(packageJson.devDependencies || {}).map((name): Package => {
      const version = packageJson.devDependencies[name];
      const label = `${chalk.yellow(name)} - ${version}`;

      return {
        dev: true,
        name,
        version,
        label
      };
    })
  ];

  const selectedPackages = await selectItems({
    items: packages.map((dep) => dep.label),
    message: 'Select the packages',
    searchString
  });

  return selectedPackages.map((index) => packages[index]);
}
