import { resolveMissingArguments } from './resolveMissingArguments';
import { inputString } from '../../common';
import { IUserArguments } from '.';

jest.mock('../../common', () => ({
  inputString: jest.fn()
}));

const mockInputString = inputString as jest.Mock<Promise<string>>;

describe('resolveMissingArguments', () => {
  beforeEach(() => {
    mockInputString.mockClear();
  });

  it('should resolve positional arguments if missing', async () => {
    mockInputString.mockResolvedValue('foo');

    const resolvedArgs = await resolveMissingArguments(
      [
        {
          type: 'sequential',
          commands: [{ commandText: 'echo $1', positionalArguments: ['$1'] }]
        }
      ],
      {
        appended: [],
        named: {},
        positional: []
      }
    );

    expect(resolvedArgs).toEqual<IUserArguments>({
      appended: [],
      named: {},
      positional: ['foo']
    });
  });

  it('should ignore resolving positional arguments if already available', async () => {
    mockInputString.mockRejectedValue(new Error('mock'));

    const resolvedArgs = await resolveMissingArguments(
      [
        {
          type: 'sequential',
          commands: [{ commandText: 'echo $1', positionalArguments: ['$1'] }]
        }
      ],
      {
        appended: [],
        named: {},
        positional: ['this']
      }
    );

    expect(resolvedArgs).toEqual<IUserArguments>({
      appended: [],
      named: {},
      positional: ['this']
    });
  });

  it('should handle mix of already available and missing positional arguments', async () => {
    mockInputString.mockResolvedValueOnce('three');

    const resolvedArgs = await resolveMissingArguments(
      [
        {
          type: 'sequential',
          commands: [
            {
              commandText: 'echo $2 $3 $1',
              positionalArguments: ['$2', '$3', '$1']
            }
          ]
        }
      ],
      {
        appended: [],
        named: {},
        positional: ['one', 'two']
      }
    );

    expect(resolvedArgs).toEqual<IUserArguments>({
      appended: [],
      named: {},
      positional: ['one', 'two', 'three']
    });
  });

  it('should handle mix of positional and named arguments', async () => {
    mockInputString.mockResolvedValueOnce('one');
    mockInputString.mockResolvedValueOnce('named');

    const resolvedArgs = await resolveMissingArguments(
      [
        {
          type: 'sequential',
          commands: [
            {
              commandText: 'echo $1 ${foo}',
              positionalArguments: ['$1']
            }
          ]
        }
      ],
      {
        appended: [],
        named: {},
        positional: []
      }
    );

    expect(resolvedArgs).toEqual<IUserArguments>({
      appended: [],
      named: { foo: 'named' },
      positional: ['one']
    });
  });

  it('should handle multiple named arguments', async () => {
    mockInputString.mockResolvedValueOnce('name1');
    mockInputString.mockResolvedValueOnce('name2');

    const resolvedArgs = await resolveMissingArguments(
      [
        {
          type: 'sequential',
          commands: [
            {
              commandText: 'echo ${foo} ${bar} ${lorem}',
              positionalArguments: []
            }
          ]
        }
      ],
      {
        appended: [],
        named: { bar: 'bar' },
        positional: []
      }
    );

    expect(resolvedArgs).toEqual<IUserArguments>({
      appended: [],
      named: { bar: 'bar', foo: 'name1', lorem: 'name2' },
      positional: []
    });
  });

  it('should only ask for positional arguments once for an execution plan', async () => {
    mockInputString.mockResolvedValueOnce('pos1');
    mockInputString.mockResolvedValueOnce('pos2');

    const resolvedArgs = await resolveMissingArguments(
      [
        {
          type: 'sequential',
          commands: [
            {
              commandText: 'echo $1 $2',
              positionalArguments: ['$1', '$2']
            },
            {
              commandText: 'echo $1 $2',
              positionalArguments: ['$1', '$2']
            }
          ]
        },
        {
          type: 'sequential',
          commands: [
            {
              commandText: 'echo $1 $2',
              positionalArguments: ['$1', '$2']
            },
            {
              commandText: 'echo $1 $2',
              positionalArguments: ['$1', '$2']
            }
          ]
        }
      ],
      {
        appended: [],
        named: {},
        positional: []
      }
    );

    expect(resolvedArgs).toEqual<IUserArguments>({
      appended: [],
      named: {},
      positional: ['pos1', 'pos2']
    });
  });

  it('should only ask for named arguments once for an execution plan', async () => {
    mockInputString.mockResolvedValueOnce('name1');
    mockInputString.mockResolvedValueOnce('name2');

    const resolvedArgs = await resolveMissingArguments(
      [
        {
          type: 'parallel',
          commands: [
            {
              commandText: 'echo ${foo} ${bar}',
              positionalArguments: []
            },
            {
              commandText: 'echo ${foo} ${bar}',
              positionalArguments: []
            }
          ]
        },
        {
          type: 'sequential',
          commands: [
            {
              commandText: 'echo ${foo} ${bar}',
              positionalArguments: []
            },
            {
              commandText: 'echo ${foo} ${bar}',
              positionalArguments: []
            }
          ]
        }
      ],
      {
        appended: [],
        named: {},
        positional: []
      }
    );

    expect(resolvedArgs).toEqual<IUserArguments>({
      appended: [],
      named: { foo: 'name1', bar: 'name2' },
      positional: []
    });
  });
});
