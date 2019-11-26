import * as chalk from 'chalk';
import { selectItems } from '../../../src/utils';

export async function selectPackages(packageJson: NcliNode.PackageJson) {
    const packages: NcliNode.IPackage[] = [
        ...Object.keys(packageJson.dependencies || {}).map(
            (name): NcliNode.IPackage => {
                const version = packageJson.dependencies[name];
                const label = `${chalk.cyan(name)} - ${version}`;

                return {
                    dev: false,
                    name,
                    version,
                    label
                };
            }
        ),
        ...Object.keys(packageJson.devDependencies || {}).map(
            (name): NcliNode.IPackage => {
                const version = packageJson.devDependencies[name];
                const label = `${chalk.yellow(name)} - ${version}`;

                return {
                    dev: true,
                    name,
                    version,
                    label
                };
            }
        )
    ];

    const selectedPackages = await selectItems(
        packages.map(dep => dep.label),
        'Select the packages'
    );

    return selectedPackages.map(index => packages[index]);
}
