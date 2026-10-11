import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import {
  buildExecArgs,
  listBinaries,
  parseBinaryArgs,
  splitArguments
} from './executeBinary';

describe('buildExecArgs', () => {
  it('should use exec for pnpm', () => {
    expect(buildExecArgs('pnpm', 'eslint', ['--fix', '.'])).toEqual([
      'exec',
      'eslint',
      '--fix',
      '.'
    ]);
  });

  it('should separate the yarn arguments from the binary arguments', () => {
    expect(buildExecArgs('yarn', 'eslint', ['--fix'])).toEqual([
      'exec',
      '--',
      'eslint',
      '--fix'
    ]);
  });

  it('should prevent npm from installing missing packages', () => {
    expect(buildExecArgs('npm', 'eslint', ['--fix'])).toEqual([
      'exec',
      '--no',
      '--',
      'eslint',
      '--fix'
    ]);
  });
});

describe('listBinaries', () => {
  let root: string;

  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'ncli-'));
  });

  afterEach(async () => {
    await fs.remove(root);
  });

  it('should list binaries without the windows shims', async () => {
    const binDirectory = path.join(root, 'node_modules', '.bin');

    for (const file of ['tsc', 'tsc.cmd', 'tsc.ps1', 'eslint', 'eslint.CMD']) {
      await fs.ensureFile(path.join(binDirectory, file));
    }

    expect(await listBinaries(root)).toEqual(['eslint', 'tsc']);
  });

  it('should return an empty list when no binaries are installed', async () => {
    expect(await listBinaries(root)).toEqual([]);
  });
});

describe('splitArguments', () => {
  it('should return no arguments for empty input', () => {
    expect(splitArguments('   ')).toEqual([]);
  });

  it('should split on whitespace', () => {
    expect(splitArguments(' --fix   src  ')).toEqual(['--fix', 'src']);
  });

  it('should keep quoted text together', () => {
    expect(splitArguments(`--grep "foo bar" --name='a b' "" it\\'s`)).toEqual([
      '--grep',
      'foo bar',
      '--name=a b',
      '',
      "it's"
    ]);
  });

  it('should throw on unterminated quotes', () => {
    expect(() => splitArguments('"foo')).toThrow();
  });
});

describe('parseBinaryArgs', () => {
  it('should parse the arguments per binary', () => {
    expect(parseBinaryArgs('{"tsc":"--noEmit","jest":"--watch"}')).toEqual({
      tsc: '--noEmit',
      jest: '--watch'
    });
  });

  it('should ignore missing or invalid values', () => {
    expect(parseBinaryArgs(undefined)).toEqual({});
    expect(parseBinaryArgs('--noEmit')).toEqual({});
    expect(parseBinaryArgs('["--noEmit"]')).toEqual({});
    expect(parseBinaryArgs('{"tsc":"--noEmit","jest":1}')).toEqual({
      tsc: '--noEmit'
    });
  });
});
