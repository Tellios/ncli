import {parseBranches} from './parseBranches.ts';

describe('parseBranch', () => {
  it('can determine if branch is local', () => {
    const branch = parseBranches('  master')[0];

    expect(branch.name).toBe('master');
    expect(branch.isRemote).toBe(false);
  });

  it('can determine if branch is remote', () => {
    const branch = parseBranches('  remotes/origin/master')[0];

    expect(branch.name).toBe('remotes/origin/master');
    expect(branch.isRemote).toBe(true);
  });

  it('can determine if branch is at HEAD', () => {
    const branch = parseBranches('* master')[0];

    expect(branch.isCurrent).toBe(true);
  });

  it('can determine if branch is not at HEAD', () => {
    const branch = parseBranches('  master')[0];

    expect(branch.isCurrent).toBe(false);
  });
});
