import chalk from 'chalk';
import {selectItems} from '../../common/index.ts';

export async function selectPackages(
  packageJson: NcliNode.PackageJson,
  searchString?: string,
): Promise<NcliNode.Package[]> {
  const packages: NcliNode.Package[] = [
    ...Object.keys(packageJson.dependencies || {}).map(
      (name): NcliNode.Package => {
        const version = packageJson.dependencies[name];
        const label = `${chalk.cyan(name)} - ${version}`;

        return {
          dev: false,
          name,
          version,
          label,
        };
      },
    ),
    ...Object.keys(packageJson.devDependencies || {}).map(
      (name): NcliNode.Package => {
        const version = packageJson.devDependencies[name];
        const label = `${chalk.yellow(name)} - ${version}`;

        return {
          dev: true,
          name,
          version,
          label,
        };
      },
    ),
  ];

  const selectedPackages = await selectItems({
    items: packages.map((dep) => dep.label),
    message: 'Select the packages',
    searchString,
  });

  return selectedPackages.map((index) => packages[index]);
}
