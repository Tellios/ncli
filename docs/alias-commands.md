# Alias commands (na)

Using alias you can have pre-define terminal commands that will be executed using their name. Arguments can also be supplied to the alias.

To create alias commands you create a `.ncli/alias.yml` file in your user folder.

```yaml
aliases:
  - name: dprune # Name to use when invoking the command
    cmd: docker system prune --all # the command
    # You can have multiple alias commands
  - name: ls
    cmd: ls -la
  - name: foo
    # Working directory can also be injected into the command
    cmd: bar ${cwd}
  - name: my-command
    cmd: do stuff
    # Aliases also have an optional field to provide some help text which will be displayed when displaying alias help.
    description: This is my description
    # You can also provide an optional working directory if you want the command to be executed in another directory than where the alias is executed
    workingDirectory: /some/directory/path
  - name: multiline
    # You can decide between running commands in parallel or sequential order
    type: parallel # default is 'sequential'
    # cmd property can also be an array,
    cmd:
      - do --this
      - do --that
  # Advanced alias tasks can also be provided where nested operations are provided
  - name: nested
    cmd:
      - name: echo
        cmd: echo Starting operations...
      - name: lint project
        cmd:
          - npm run prettier
          - npm run eslint
      - name: build project
        # A child task can also be set to run in parallel for its commands
        type: parallel
        cmd:
          - npm run build
          - npm run test
          - npm run lint
      - name: Run
        cmd: node main.js
        # Working directory can be specified as well
        workingDirectory: dist
```

With the file above you can then invoke aliases like this:

```bash
na run dprune
```

Arguments can also be appended to the alias:

```bash
na run dprune -- --volumes
```

This is equal to running:

```bash
docker system prune --all --volumes
```

You can display help and all available aliases by running:

```bash
na list
```

You can also print the command that will be executed without running it:

```bash
na run --print dprune --volumes

# Prints
Sequential: [
  Sequential: [
    docker system prune --all --volumes
  ]
]
```

## Arguments

### Positional

Commands can also have positional arguments and are defined by a `$` followed by a number. The number indicates the order the arguments will be injected in. Multiple positional arguments can therefore be combined. A positional argument can also be repeated multiple times in the command.

```yaml
aliases:
  - name: my-alias
    cmd: foo $1 --arg --other-arg
```

Positional arguments will be treated as required arguments and must be supplied when invoking the alias. If not provided they will be asked for before executing the command:

```bash
# Will ask for missing argument
na run my-alias

# Here we provide it so will be executed immediately
na run my-alias --my-arg
```

Positional arguments will be kept as is for all commands executed, even for nested operations. So specifying `$1` for multiple commands will be resolved to the same value for all commands.

#### Examples

```yaml
aliases:
  # Run npm wrapped in a docker container using working directory argument
  # Triggerd by running na npm install
  - name: npm
    cmd: docker run --rm -w /opt/workdir -v ${cwd}/:/opt/workdir node:8.9.4-alpine npm
  # Run npm wrapped in a docker container with version as a positional argument
  # Triggerd by running na npm 8.9.4 install
  - name: npm-v
    cmd: docker run --rm -w /opt/workdir -v ${cwd}/:/opt/workdir node:$1-alpine npm
```

### Named

Instead of relying on positional arguments, you can also rely on named arguments to make them easier to remember/understand. Same as with positional arguments, a named argument can occur multiple times in a command. If not provided they will be asked for before executing the command.

To create a named argument, simply insert `${nameOfVariable}` into the command.

So if we wanted to insert a node version into a docker script like the one below:

```yaml
aliases:
  - name: npm
    cmd: docker run --rm -w /opt/workdir -v ${cwd}/:/opt/workdir node:${nodeVersion}-alpine npm
  #                                      Argument name provided here: ^^^^^^^^^^^^^^
```

We would trigger it like this:

```bash
na run npm --nodeVersion=10.12
```

Named arguments will be kept as is for all commands executed, even for nested operations. So specifying `${named}` for multiple commands will be resolved to the same value for all commands.

#### Built-in named parameters

Some named parameters are provied out-of-the-box and do not need to be provided when using an alias on the command-line.

| Name     | Description                           |
| -------- | ------------------------------------- |
| `${cwd}` | Injects the current working directory |

### Appended

In some cases you may want to append whatever argument you are typing into the command. To do this you can use `--` after all other arguments followed by the arguments you want to append directly to the command.

#### Examples

```bash
na run npm -- install --save-dev typescript
```

```bash
na run npm positionalArg --named=${arg} -- --appended-arg
```
