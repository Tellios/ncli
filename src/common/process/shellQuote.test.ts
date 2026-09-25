import { shellQuote } from './shellQuote';
import {
  buildInteractiveShellCommand,
  getInteractiveSpawn
} from './runInteractiveCommand';

describe('shellQuote', () => {
  it('should leave simple tokens unquoted', () => {
    expect(shellQuote('yarn')).toBe('yarn');
    expect(shellQuote('test-hub')).toBe('test-hub');
  });

  it('should quote values with spaces', () => {
    expect(shellQuote('foo bar')).toBe("'foo bar'");
  });
});

describe('runInteractiveCommand', () => {
  it('should wrap command with working directory cd', () => {
    expect(
      buildInteractiveShellCommand('yarn test -- --watch', '/tmp/work')
    ).toBe('cd /tmp/work && yarn test -- --watch');
  });

  it('should build script spawn args on linux', () => {
    const platform = process.platform;
    Object.defineProperty(process, 'platform', { value: 'linux' });

    expect(getInteractiveSpawn('yarn test', '/tmp/work')).toEqual({
      file: 'script',
      args: ['-q', '-c', 'cd /tmp/work && yarn test', '/dev/null']
    });

    Object.defineProperty(process, 'platform', { value: platform });
  });
});
