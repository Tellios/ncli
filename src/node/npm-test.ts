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
    describe: 'Use test task with watcher instead of single-run',
    type: 'boolean'
  })
  .option('workspace', {
    alias: 'w',
    describe:
      'If the test should be executed inside a workspace project instead',
    type: 'boolean'
  }).argv;

await commandBase<'nt'>(async ({ workingDirectory, settings, setSetting }) => {
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

  const testScripts = searchScripts(
    args.watch ? /test:watch|test-watch|test_watch$/iv : /test$/iv,
    scripts
  );

  const testScriptKeys = Object.keys(testScripts);

  if (testScriptKeys.length === 0) {
    ConsoleInterface.printLine('No test scripts found');
  } else if (testScriptKeys.length === 1) {
    await executePackageJsonScript(
      testScriptKeys[0],
      testScripts,
      workingDirectory
    );
  } else {
    const scriptToRun = await selectScript(testScripts);
    await executePackageJsonScript(scriptToRun, testScripts, workingDirectory);
  }
});
