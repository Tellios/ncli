import {
  yargsWrapper,
  ConsoleInterface,
  commandBase
} from '../common/index.ts';
import {
  parsePackageJson,
  searchScripts,
  selectScript,
  selectWorkspace,
  executePackageJsonScript
} from './utils/index.ts';

const args = yargsWrapper()
  .option('watch', {
    alias: 'W',
    describe: 'Use build task with watcher instead of single-run',
    type: 'boolean'
  })
  .option('workspace', {
    alias: 'w',
    describe:
      'If the build should be executed inside a workspace project instead',
    type: 'boolean'
  })
  .parseSync();

await commandBase<'nb'>(async ({ workingDirectory, settings, setSetting }) => {
  let packageJson = await parsePackageJson(workingDirectory);

  if (args.workspace) {
    const workspace = await selectWorkspace(
      workingDirectory,
      packageJson,
      settings.lastSelectedWorkspace
    );

    await setSetting('lastSelectedWorkspace', workspace.relativePath);
    workingDirectory = workspace.absolutePath;
    packageJson = await parsePackageJson(workingDirectory);
  }

  const { scripts } = packageJson;

  let buildScripts;

  if (args.watch) {
    buildScripts = searchScripts(
      /build:watch|build-watch|build_watch$/iv,
      scripts
    );
  } else {
    buildScripts = searchScripts(/build$/iv, scripts);
  }

  const buildScriptKeys = Object.keys(buildScripts);

  if (buildScriptKeys.length === 0) {
    ConsoleInterface.printLine('No build scripts found');
  } else if (buildScriptKeys.length === 1) {
    await executePackageJsonScript(
      buildScriptKeys[0],
      buildScripts,
      workingDirectory
    );
  } else {
    const scriptToRun = await selectScript(buildScripts);
    await executePackageJsonScript(scriptToRun, buildScripts, workingDirectory);
  }
});
