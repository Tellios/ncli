import { parseCommand } from './parseCommand';
import { ICommand } from '../alias.interfaces';

describe('parseCommand', () => {
  it('should return the positonal arguments and command text', () => {
    const command = parseCommand('test $1 $2');
    const expected: ICommand[] = [
      {
        commandText: 'test $1 $2',
        positionalArguments: ['$1', '$2']
      }
    ];

    expect(command).toEqual(expected);
  });

  it('should only return a positional argument once', () => {
    const command = parseCommand('test $1 $1 $2');
    const expected: ICommand[] = [
      {
        commandText: 'test $1 $1 $2',
        positionalArguments: ['$1', '$2']
      }
    ];

    expect(command).toEqual(expected);
  });

  it('should return empty positional arguments array if there are none', () => {
    const command = parseCommand('docker rm -f');
    const expected: ICommand[] = [
      {
        commandText: 'docker rm -f',
        positionalArguments: []
      }
    ];

    expect(command).toEqual(expected);
  });

  it('should handle multiple commands at the same time', () => {
    const command = parseCommand(['docker rm -f $2', 'echo test arg $1']);
    const expected: ICommand[] = [
      {
        commandText: 'docker rm -f $2',
        positionalArguments: ['$2']
      },
      {
        commandText: 'echo test arg $1',
        positionalArguments: ['$1']
      }
    ];

    expect(command).toEqual(expected);
  });

  it('should throw if command text is empty', () => {
    expect(() => parseCommand('')).toThrowError();
  });

  it('true', () => {
    expect(true).toBe(true);
  });
});
