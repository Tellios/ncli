# Docker commands

## ndps

Prints docker containers.

| Argument | Alias | Description                               |
| -------- | ----- | ----------------------------------------- |
| running  | r     | Optional. Only display running containers |

```bash
ndps -r
```

## ndrm

Allows the selection and removal of one or multiple containers.

| Argument | Alias | Description                                          |
| -------- | ----- | ---------------------------------------------------- |
| running  | r     | Optional. Only display running containers            |
| force    | f     | Optional. Remove containers even if they are running |

```bash
ndrm -f -r
```

## ndstart

Start one or more stopped docker containers.

```bash
ndstart
```

## ndstop

Stop one or more running docker containers.

```bash
ndstop
```
