import {
  detectInteractiveCommand,
  resolveStepInteractive
} from './detectInteractiveCommand';

describe('detectInteractiveCommand', () => {
  it('should detect jest watch flags', () => {
    expect(detectInteractiveCommand('yarn test -- --watch')).toBe(true);
    expect(detectInteractiveCommand('jest --watchAll')).toBe(true);
  });

  it('should detect docker interactive flags', () => {
    expect(detectInteractiveCommand('docker run -it image sh')).toBe(true);
  });

  it('should not detect regular commands', () => {
    expect(detectInteractiveCommand('yarn build')).toBe(false);
  });
});

describe('resolveStepInteractive', () => {
  it('should prefer explicit alias config', () => {
    expect(resolveStepInteractive('yarn build', true)).toBe(true);
    expect(resolveStepInteractive('yarn test -- --watch', false)).toBe(false);
  });

  it('should auto-detect when not configured', () => {
    expect(resolveStepInteractive('yarn test -- --watch', undefined)).toBe(
      true
    );
  });
});
