# Editor configuration

XREFCLI has the possibility to open files from the commandline. This can either be an external GUI program like visual studio code for example or other commandline tools like `view`, the read-only version of `vi'.

## `.xrefcli/xrefconfig.json`
In this file, located in either `%USERPROFILE%` or `$HOME`, the setup of the editor is done. The `editor` node must be in the root of the configuration JSON.

```
{
  "current": "tst1",
  "editor": {
    "name": "vi",
    "type": "cli",
    "executable": "view",
    "open": "%s"
  },
  ....
```

Properties:
- `name`: for reference, use names like 'vi', 'bash' or 'vscode'
- `type`: either `cli` or `gui`. The `cli` option is CLI interfaces and the executable is run in the same console
- `executable`: either fully qualified or just the command name, depending on the PATH
- `open`: options for opening files. There are two placeholders:
  - `%r` the root directory for the files and
  - `%s` the files to open

## Sample configration VS Code
```
  "editor": {
    "name": "vscode",
    "type": "gui",
    "executable": "C:\\Program Files\\Microsoft VS Code\\bin\\code.cmd",
    "open": "%r --new-window --goto %s"
  }
```

## Sample configuration View
```
  "editor": {
    "name": "bash",
    "type": "cli",
    "executable": "view",
    "open": "%s"
  },
```





