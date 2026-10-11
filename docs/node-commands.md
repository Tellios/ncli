# Node commands

## nr

Executes and manages NPM package.json scripts. Scripts are executed using the package manager (NPM, Yarn or PNPM) detected from the project's lock file. The lock file is searched for in the current directory and its parent directories up to the git repository root, so commands run inside a workspace package use the package manager of the monorepo.

| Argument  | Alias | Description                                     |
| --------- | ----- | ----------------------------------------------- |
| list      | l     | Lists the available NPM scripts                 |
| add       | a     | Add a new NPM script                            |
| async     |       | Select multiple NPM scripts to run concurrently |
| edit      | e     | Edit an existing NPM script                     |
| delete    | d     | Delete an existing NPM script                   |
| workspace | w     | Execute the script inside a workspace project   |

Run a package.json script:

```bash
nr [script]
```

Run multiple package.json scripts concurrently:

```bash
nr [script1] [script2]
```

When multiple scripts are executed at the same time you can filter their `stdout` output using the shortcut `Ctrl + L`. This is helpful if you want to run multiple scripts, but you are only interested in the output from some of them.

Select a package.json script from a list to run:

```bash
nr
```

Select multiple package.json scripts from a list to run concurrently:

```bash
nr --async
```

## nb

Executes build scripts located in an NPM package.json file. If multiple test tasks matches `nb`s internal filters you will be able
to select the script to use.

| Argument  | Alias | Description                                     |
| --------- | ----- | ----------------------------------------------- |
| watch     | W     | Run build scripts that rely on watchers instead |
| workspace | w     | Run build scripts inside a workspace project    |

Run builds in a package.json file:

```bash
nb
```

Run build scripts that rely on watchers:

```bash
nb -W
```

Run build scripts inside a workspace project selected from a list:

```bash
nb -w
```

## nt

Executes test scripts located in an NPM package.json file. If multiple test tasks matches `nt`s internal filters you will be able
to select the script to use.

| Argument  | Alias | Description                                    |
| --------- | ----- | ---------------------------------------------- |
| watch     | W     | Run test scripts that rely on watchers instead |
| workspace | w     | Run test scripts inside a workspace project    |

Run tests in a package.json file:

```bash
nt
```

Run test scripts that rely on watchers:

```bash
nt -W
```

Run test scripts inside a workspace project selected from a list:

```bash
nt -w
```

## ni

Executes commands that manages NPM, Yarn or PNPM dependencies. Auto-detects the usage of NPM, Yarn or PNPM, based on the presence of their respective lock files, defaulting to NPM when none is found. Workspaces are read from `package.json` or, for PNPM, `pnpm-workspace.yaml`.

### ni add

Adds one or multiple packages. Can install both normal dependencies and dev dependencies in the same command.

| Argument   | Alias | Description                                                                                                                                                   |
| ---------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dev        | d     | All packages after the dev flag will be installed as dev dependencies                                                                                         |
| auto-types | a     | Automatically install @types packages for the packages being installed. If auto-types is provided after the dev flag, they will be installed as dev packages. |

Install packages:

```bash
ni add react react-router express
```

Install dev packages:

```bash
ni add --dev typescript webpack webpack-cli
```

Install packages with their typings packages:

```bash
# Typings as normal dependencies
ni add react react-router --auto-types

# Typings as dev dependencies
ni add react react-router --dev --auto-types
```

### ni del

Uninstall one or more packages selected from a list in the terminal.

```bash
ni del
```

### ni update

Update one or more packages to their latest version. Packages are selected from a list in the terminal.

```
ni update
```
