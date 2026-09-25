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

### Optional alias fields

| Field              | Required | Description                                                                                           |
| ------------------ | -------- | ----------------------------------------------------------------------------------------------------- |
| `description`      | No       | Help text shown in `na list`                                                                          |
| `workingDirectory` | No       | Directory to run the alias in (instead of the current directory)                                      |
| `interactive`      | No       | When `true`, passes your terminal through to the command (needed for `docker run -it`, shells, REPLs) |

## Interactive aliases

By default, alias commands run without attaching your terminal stdin. That is fine for most commands, but Docker fails with **cannot attach stdin to a TTY-enabled container because stdin is not a terminal** when the command uses `-t` or `-it`.

Set `interactive: true` on the alias (or on a nested task) so `na run` runs the command in a pseudo-TTY. That is required for `docker run -it`, Jest `--watch`, and other tools that read keyboard input. Without it, stdin is ignored and menus like Jest watch will not accept input.

Commands with `--watch`, `--watchAll`, or `-it` are treated as interactive automatically unless you set `interactive: false`.

```yaml
aliases:
  - name: test-hub
    interactive: true
    cmd: yarn test -- --watch
    workingDirectory: /path/to/project
  - name: drun
    interactive: true
    cmd: docker run -it --rm -v ${cwd}:/work -w /work alpine sh
```

For nested workflows, enable interactivity only on the step that needs it:

```yaml
- name: dev
  cmd:
    - name: prep
      cmd: docker pull myimage
    - name: shell
      interactive: true
      cmd: docker run -it --rm myimage bash
    - name: after shell
      cmd: echo Back on the host
```

Interactive steps use your terminal like any other sequential command: if the command exits with a non-zero code, the rest of the alias does not run.

Run `na` from a real terminal (`stdin` must be a TTY). Pipes, CI, or non-interactive environments may still fail.

Do not combine `interactive: true` with `type: parallel` when a step runs multiple commands at once; stdin cannot be shared across parallel processes.

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
  # Interactive shell inside a container (requires interactive: true for -it)
  - name: node-sh
    interactive: true
    cmd: docker run -it --rm -w /opt/workdir -v ${cwd}/:/opt/workdir node:${nodeVersion}-alpine sh
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
