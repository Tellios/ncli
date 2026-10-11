import {injectArguments} from './inject-arguments.ts';

describe('injectArguments', () => {
  it('should throw if positional arguments are missing', () => {
    expect(() =>
      injectArguments(
        [
          {
            commandText: 'test $1',
            positionalArguments: ['$1'],
          },
        ],
        {positional: [], named: {}, appended: []},
        '/opt',
      ),
    ).toThrowError();

    expect(() =>
      injectArguments(
        [
          {
            commandText: 'test $1',
            positionalArguments: ['$1', '$2'],
          },
        ],
        {positional: ['1'], named: {}, appended: []},
        '/opt',
      ),
    ).toThrowError();
  });

  it('should return command text without arguments if no arguments are specified in command text', () => {
    const commandTexts = injectArguments(
      [
        {
          commandText: 'test',
          positionalArguments: [],
        },
      ],
      {positional: ['1', '2'], named: {}, appended: []},
      '/opt',
    );

    expect(commandTexts).toEqual(['test']);
  });

  it('should inject positional arguments into command text', () => {
    const commandTexts = injectArguments(
      [
        {
          commandText: 'test $1 $2',
          positionalArguments: ['$1', '$2'],
        },
      ],
      {positional: ['1', '2'], named: {}, appended: []},
      '/opt',
    );

    expect(commandTexts).toEqual(['test 1 2']);
  });

  it('should only inject positional arguments that are available in command text', () => {
    const commandTexts = injectArguments(
      [
        {
          commandText: 'test $1 $3',
          positionalArguments: ['$1', '$3'],
        },
      ],
      {positional: ['1', '2', '3', '4'], named: {}, appended: []},
      '/opt',
    );

    expect(commandTexts).toEqual(['test 1 3']);
  });

  it('should inject working directory', () => {
    const commandTexts = injectArguments(
      [
        {
          commandText: 'test ${cwd} $2',
          positionalArguments: ['$2'],
        },
      ],
      {positional: ['1', '2'], named: {}, appended: []},
      '/opt',
    );

    expect(commandTexts).toEqual(['test /opt 2']);
  });

  it('should handle multiple commands', () => {
    const commandTexts = injectArguments(
      [
        {
          commandText: 'test ${cwd}',
          positionalArguments: [],
        },
        {
          commandText: 'echo $2',
          positionalArguments: ['$2'],
        },
        {
          commandText: 'foo $1 $2 ${cwd}',
          positionalArguments: ['$1', '$2'],
        },
      ],
      {positional: ['1', '2'], named: {}, appended: []},
      '/opt',
    );

    expect(commandTexts).toEqual(['test /opt', 'echo 2', 'foo 1 2 /opt']);
  });

  it('should handle both named and positional arguments', () => {
    const commandTexts = injectArguments(
      [
        {
          commandText: 'test ${cwd} --name=${name}',
          positionalArguments: [],
        },
        {
          commandText: 'echo $2 --test=${test}',
          positionalArguments: ['$2'],
        },
        {
          commandText: 'foo $1 $2 ${cwd} --name=${name}',
          positionalArguments: ['$1', '$2'],
        },
      ],
      {
        positional: ['1', '2'],
        named: {name: 'foo', test: 'bar'},
        appended: [],
      },
      '/opt',
    );

    expect(commandTexts).toEqual([
      'test /opt --name=foo',
      'echo 2 --test=bar',
      'foo 1 2 /opt --name=foo',
    ]);
  });

  it('should handle append arguments', () => {
    const commandTexts = injectArguments(
      [
        {
          commandText: 'test ${cwd} --name=${name}',
          positionalArguments: [],
        },
        {
          commandText: 'echo $2 --test=${test}',
          positionalArguments: ['$2'],
        },
        {
          commandText: 'foo $1 $2 ${cwd} --name=${name}',
          positionalArguments: ['$1', '$2'],
        },
      ],
      {
        positional: ['1', '2'],
        named: {name: 'foo', test: 'bar'},
        appended: ['install'],
      },
      '/opt',
    );

    expect(commandTexts).toEqual([
      'test /opt --name=foo install',
      'echo 2 --test=bar install',
      'foo 1 2 /opt --name=foo install',
    ]);
  });
});
