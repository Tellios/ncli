# Kubernetes commands

## nk

Provides multiple commands for easy access to some commonly used `kubectl` features.

### Query resources commands

All commands that query Kubernetes resources provide the following arguments:

| Argument   | Alias | Description                                                    |
| ---------- | ----- | -------------------------------------------------------------- |
| deployment | d     | Optional. Quick select deployment(s) as target for the command |
| pod        | p     | Optional. Quick select pod(s) as target for the command        |
| service    | d     | Optional. Quick select service(s) as target for the command    |
| ingress    | d     | Optional. Quick select ingress(es) as target for the command   |

#### desc

Describe a kubernetes resource

```bash
# Will allow you to select a specific pod to describe
nk desc -p
```

#### list

List all resources

```bash
# Will list all pods
nk list -p
```

### ctx

Allows switching between the available `kubectl` contexts provided by `kubectl config view`.

You can allow contexts from multiple configs by using the built-in `kubectl` environment variable:
`KUBECONFIG`. Just add every file with a colon as a separator:

```bash
export KUBECONFIG=/some/path/config1:/other/path/config2:$HOME/.kube/config
```
