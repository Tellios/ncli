declare namespace NcliNode {
  type IPackageJson = {
    name?: string;
    workspaces?: string[];
    scripts: Scripts;
    dependencies: Dependencies;
    devDependencies: Dependencies;
  };

  type IPackage = {
    dev: boolean;
    name: string;
    version: string;
    label: string;
  };

  type Scripts = Record<string, string>;
  type Dependencies = Record<string, string>;
}
