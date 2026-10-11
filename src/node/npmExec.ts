import {
  yargsWrapper,
  ConsoleInterface,
  commandBase,
  selectItem,
  inputString
} from '../common';
import {
  parsePackageJson,
  selectWorkspace,
  executeBinary,
  listBinaries,
  splitArguments,
  parseBinaryArgs
} from './utils';

const args = yargsWrapper(false)
  // Stop parsing at the binary name so its arguments are passed through
  .parserConfiguration({ 'halt-at-non-option': true })
  .option('workspace', {
    alias: 'w',
    describe:
      'If the binary should be executed inside a workspace project instead',
    type: 'boolean'
  }).argv;

commandBase<'nex'>(async ({ workingDirectory, settings, setSetting }) => {
  if (args.workspace) {
    const packageJson = await parsePackageJson(workingDirectory);
    const workspace = await selectWorkspace(
      workingDirectory,
      packageJson,
      settings.lastSelectedWorkspace
    );

    await setSetting('lastSelectedWorkspace', workspace.relativePath);
    workingDirectory = workspace.absolutePath;
  }

  const [cmd, ...cmdArgs] = args._.map((a) => a.toString());

  if (cmd !== undefined) {
    await executeBinary(cmd, cmdArgs, workingDirectory);
    return;
  }

  const binaries = await listBinaries(workingDirectory);

  if (binaries.length === 0) {
    ConsoleInterface.printLine('No binaries found in node_modules/.bin');
    return;
  }

  const selectedBinary =
    binaries[
      await selectItem(binaries, 'Select binary', settings.lastExecutedBinary)
    ];

  const binaryArgsPerBinary = parseBinaryArgs(settings.binaryArgs);

  const binaryArgs = await inputString(
    'Arguments (optional):',
    (input) => {
      try {
        splitArguments(input);
        return true;
      } catch (err) {
        return (err as Error).message;
      }
    },
    binaryArgsPerBinary[selectedBinary]
  );

  await setSetting('lastExecutedBinary', selectedBinary, workingDirectory);
  await setSetting(
    'binaryArgs',
    JSON.stringify({ ...binaryArgsPerBinary, [selectedBinary]: binaryArgs }),
    workingDirectory
  );

  await executeBinary(
    selectedBinary,
    splitArguments(binaryArgs),
    workingDirectory
  );
});
