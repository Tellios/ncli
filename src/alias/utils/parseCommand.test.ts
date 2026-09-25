import { parseCommand } from './parseCommand';
import { ExecutionPlan } from '../alias.interfaces';

describe('parseCommand', () => {
  it('should return the positonal arguments and command text', () => {
    const command = parseCommand({ name: 'mock', cmd: 'test $1 $2' });
    const expected: ExecutionPlan = [
      {
        type: 'sequential',
        commands: [
          {
            commandText: 'test $1 $2',
            positionalArguments: ['$1', '$2']
          }
        ]
      }
    ];

    expect(command).toEqual(expected);
  });

  it('should only return a positional argument once', () => {
    const command = parseCommand({ name: 'mock', cmd: 'test $1 $1 $2' });
    const expected: ExecutionPlan = [
      {
        type: 'sequential',
        commands: [
          {
            commandText: 'test $1 $1 $2',
            positionalArguments: ['$1', '$2']
          }
        ]
      }
    ];

    expect(command).toEqual(expected);
  });

  it('should return empty positional arguments array if there are none', () => {
    const command = parseCommand({ name: 'mock', cmd: 'docker rm -f' });
    const expected: ExecutionPlan = [
      {
        type: 'sequential',
        commands: [{ commandText: 'docker rm -f', positionalArguments: [] }]
      }
    ];

    expect(command).toEqual(expected);
  });

  it('should handle multiple commands at the same time', () => {
    const command = parseCommand({
      name: 'mock',
      cmd: ['docker rm -f $2', 'echo test arg $1']
    });
    const expected: ExecutionPlan = [
      {
        type: 'sequential',
        commands: [
          { commandText: 'docker rm -f $2', positionalArguments: ['$2'] },
          { commandText: 'echo test arg $1', positionalArguments: ['$1'] }
        ]
      }
    ];

    expect(command).toEqual(expected);
  });

  it('should handle task alias', () => {
    const command = parseCommand({
      name: 'mock',
      type: 'parallel',
      cmd: [
        { name: 'step 1', cmd: ['docker rm -f $2', 'docker rm -f ${named}'] },
        { name: 'step 2', type: 'sequential', cmd: 'echo test arg $1' },
        {
          name: 'step 3',
          type: 'parallel',
          cmd: ['echo test step 3', 'this is parallel', 'and mocked']
        }
      ]
    });
    const expected: ExecutionPlan = [
      {
        name: 'step 1',
        type: 'sequential',
        commands: [
          { commandText: 'docker rm -f $2', positionalArguments: ['$2'] },
          { commandText: 'docker rm -f ${named}', positionalArguments: [] }
        ],
        workingDirectory: undefined
      },
      {
        name: 'step 2',
        type: 'sequential',
        commands: [
          { commandText: 'echo test arg $1', positionalArguments: ['$1'] }
        ],
        workingDirectory: undefined
      },
      {
        name: 'step 3',
        type: 'parallel',
        commands: [
          { commandText: 'echo test step 3', positionalArguments: [] },
          { commandText: 'this is parallel', positionalArguments: [] },
          { commandText: 'and mocked', positionalArguments: [] }
        ],
        workingDirectory: undefined
      }
    ];

    expect(command).toEqual(expected);
  });

  it('should throw if command text is empty', () => {
    expect(() => parseCommand({ name: 'mock', cmd: '' })).toThrowError();
  });

  it('should propagate interactive flag on top-level alias', () => {
    const command = parseCommand({
      name: 'mock',
      interactive: true,
      cmd: 'docker run -it alpine sh'
    });

    expect(command).toEqual([
      {
        type: 'sequential',
        interactive: true,
        commands: [
          {
            commandText: 'docker run -it alpine sh',
            positionalArguments: []
          }
        ]
      }
    ]);
  });

  it('should inherit interactive from alias and allow task override', () => {
    const command = parseCommand({
      name: 'mock',
      interactive: true,
      cmd: [
        { name: 'prep', cmd: 'docker pull alpine' },
        {
          name: 'shell',
          interactive: false,
          cmd: 'docker run alpine echo hi'
        },
        { name: 'interactive shell', cmd: 'docker run -it alpine sh' }
      ]
    });

    expect(command).toEqual([
      {
        name: 'prep',
        type: 'sequential',
        interactive: true,
        workingDirectory: undefined,
        commands: [
          { commandText: 'docker pull alpine', positionalArguments: [] }
        ]
      },
      {
        name: 'shell',
        type: 'sequential',
        interactive: false,
        workingDirectory: undefined,
        commands: [
          { commandText: 'docker run alpine echo hi', positionalArguments: [] }
        ]
      },
      {
        name: 'interactive shell',
        type: 'sequential',
        interactive: true,
        workingDirectory: undefined,
        commands: [
          { commandText: 'docker run -it alpine sh', positionalArguments: [] }
        ]
      }
    ]);
  });
});
