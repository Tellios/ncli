import {localizeBranchName} from './localize-branch-name.ts';

describe('parseBranch', () => {
  it('does not change local branch name', () => {
    const name = localizeBranchName('master');
    expect(name).toBe('master');
  });

  it('removes remote specification in branch name', () => {
    const name = localizeBranchName('remotes/origin/master');
    expect(name).toBe('master');
  });
});
