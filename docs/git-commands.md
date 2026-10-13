# Git commands

## nclone

Performs a `git clone`.

| Argument  | Alias | Description                                |
| --------- | ----- | ------------------------------------------ |
| url       | u     | Repository url to clone                    |
| directory | d     | Optional name for the checkout directory   |
| code      | c     | Open Visual Studio Code for the repository |

```bash
nclone -u https://git-server/repo.git -d Foo -c
```

## ncommit

Stages all un-staged files, commits the changes, and optionally pushes them to the remote.

| Argument | Alias | Description                                     |
| -------- | ----- | ----------------------------------------------- |
| addAll   | a     | Stage all git changes (git add .) before commit |
| message  | m     | Commit message                                  |
| push     | p     | Optional. Push to the remote after commit       |

```bash
ncommit -m "I made some changes" -p
```

## ncb

Creates a git branch.

| Argument | Alias | Description                             |
| -------- | ----- | --------------------------------------- |
| branch   | b     | Branch name                             |
| push     | p     | Optional. Push the branch to the remote |

```bash
ncb -b feature/my-branch -p
```

## ngcb

Prints the current git branch.

```bash
ngcb
```

## ngb

Prints available git branches.

- Green: current branch
- Blue: local branch
- Cyan: Remote branch

| Argument | Alias | Description                       |
| -------- | ----- | --------------------------------- |
| remote   | r     | Optional. Include remote branches |
| filter   | f     | Optional. Branch name filter      |

```bash
ngb -r -f my-branch-name
```

## nmf

Merge from another branch into this branch using `--no-ff`. Will print a list of all available branches and will allow easy select between them.

| Argument | Alias | Description                                            |
| -------- | ----- | ------------------------------------------------------ |
| branch   | b     | Optional. Name of the branch to merge from             |
| filter   | f     | Optional. Branch name filter if no branch is specified |

```bash
nmf -b feature/other-branch
```

## nmt

Merge to another branch from the current branch using `--no-ff`. Will print a list of all available branches and will allow easy select between them.

| Argument | Alias | Description                                            |
| -------- | ----- | ------------------------------------------------------ |
| branch   | b     | Optional. Name of the branch to merge to               |
| filter   | f     | Optional. Branch name filter if no branch is specified |

```bash
nmt -b feature/other-branch
```

## nrb

Deletes a branch. Will print a list of all available branches and will allow easy select between them.

| Argument | Alias | Description                                |
| -------- | ----- | ------------------------------------------ |
| branch   | b     | Optional. Specifies the branch to delete   |
| push     | p     | Optional. Also delete branch on the remote |
| filter   | f     | Optional. Branch name filter               |

```bash
nrb -b feature/branch-to-delete -p
```

## nstatus

Prints the git status.

- Green: added file
- Yellow: modified file
- Red: deleted file

| Argument | Alias | Description                        |
| -------- | ----- | ---------------------------------- |
| new      | n     | Optional. Only show new files      |
| modified | m     | Optional. Only show modified files |
| deleted  | d     | Optional. Only show deleted files  |

```bash
nstatus
```

## nsb

Checkout/switch branch. Prints all available branches and allows easy selection between them.

| Argument | Alias | Description                                               |
| -------- | ----- | --------------------------------------------------------- |
| branch   | b     | Optional. Name of the branch                              |
| remote   | r     | Optional. Include remote branches when selecting branches |
| filter   | f     | Optional. Branch name filter                              |

```bash
nsb -r

nsb -b feature/other-branch
```

## npull

Performs a `git pull`.

```bash
npull
```

## npush

Performs a `git push`.

```bash
npush
```

## nupstream

Pushes current branch to the remote.

```bash
nupstream
```
