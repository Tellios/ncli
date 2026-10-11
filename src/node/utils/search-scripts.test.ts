import {searchScripts} from './search-scripts.ts';

describe('searchScripts', () => {
  it('should return all matching scripts', () => {
    const matchingScripts = searchScripts(/foo/i, {
      foo: 'bar',
      foo2: 'bar2',
      other: 'not included',
      'foo-bar': 'bar3',
      'not-foIncludedo': 'not included',
      'foo:bar': 'bar4',
    });

    expect(matchingScripts).toEqual({
      foo: 'bar',
      foo2: 'bar2',
      'foo-bar': 'bar3',
      'foo:bar': 'bar4',
    });
  });

  it('should return empty record if no scripts match pattern', () => {
    const matchingScripts = searchScripts(/pattern/i, {
      foo: 'bar',
      bar: 'foo',
    });

    expect(matchingScripts).toEqual({});
  });
});
