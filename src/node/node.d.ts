declare namespace NcliNode {
  type PackageJson = {
    name?: string;
    workspaces?: string[];
    scripts: Scripts;
    dependencies: Dependencies;
    devDependencies: Dependencies;
  };

  type Package = {
    dev: boolean;
    name: string;
    version: string;
    label: string;
  };

  type Scripts = Record<string, string>;
  type Dependencies = Record<string, string>;
}
