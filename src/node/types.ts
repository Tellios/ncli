export type Scripts = Record<string, string>;
export type Dependencies = Record<string, string>;

export type PackageJson = {
  name?: string;
  workspaces?: string[];
  scripts: Scripts;
  dependencies: Dependencies;
  devDependencies: Dependencies;
};

export type Package = {
  dev: boolean;
  name: string;
  version: string;
  label: string;
};
