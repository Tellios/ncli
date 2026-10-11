import os from 'node:os';
import path from 'node:path';
import fs from 'fs-extra';
import {
  detectPackageManagerOrUseDefault,
  detectPackageManager,
} from './detectPackageManager.ts';

describe('detectPackageManager', () => {
  let root: string;

  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'ncli-'));
  });

  afterEach(async () => {
    await fs.remove(root);
  });

  it('should detect the lock file in the directory', async () => {
    await fs.ensureFile(path.join(root, 'pnpm-lock.yaml'));
    await fs.ensureFile(path.join(root, 'package-lock.json'));

    expect(await detectPackageManagerOrUseDefault(root)).toEqual('pnpm');
  });

  it('should detect the lock file of the monorepo root from a workspace package', async () => {
    const workspace = path.join(root, 'packages', 'foo');
    await fs.ensureDir(path.join(root, '.git'));
    await fs.ensureFile(path.join(root, 'yarn.lock'));
    await fs.ensureDir(workspace);

    expect(await detectPackageManagerOrUseDefault(workspace)).toEqual('yarn');
  });

  it('should prefer the packageManager field over a stale lock file closer to the workspace', async () => {
    const workspace = path.join(root, 'hub', 'client');
    await fs.ensureDir(path.join(root, '.git'));
    await fs.writeJson(path.join(root, 'package.json'), {
      packageManager: 'pnpm@9.0.0+sha512.abc',
    });
    await fs.ensureFile(path.join(root, 'pnpm-lock.yaml'));
    await fs.ensureFile(path.join(root, 'child', 'yarn.lock'));
    await fs.ensureDir(workspace);

    expect(await detectPackageManager(workspace)).toEqual('pnpm');
  });

  it('should ignore an unknown packageManager field', async () => {
    await fs.writeJson(path.join(root, 'package.json'), {
      packageManager: 'bun@1.0.0',
    });
    await fs.ensureFile(path.join(root, 'yarn.lock'));

    expect(await detectPackageManager(root)).toEqual('yarn');
  });

  it('should stop searching at the git repository root and default to npm', async () => {
    const repo = path.join(root, 'repo');
    await fs.ensureFile(path.join(root, 'pnpm-lock.yaml'));
    await fs.ensureDir(path.join(repo, '.git'));

    expect(await detectPackageManager(repo)).toBeUndefined();
    expect(await detectPackageManagerOrUseDefault(repo)).toEqual('npm');
  });
});
