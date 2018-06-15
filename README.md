# OpenEdge XREF CLI
The XREF CLI package gives the possibility to search in OpenEdge `.xref` files via the `xref` command.
The tools is built around repositories. The flow is:

- initialize a repository with `xref init...`
- parse the directory with `.xref` files
- search for field and table references


## `xref` commands

### `init`
```
xref init --dir <xref file dir> [--srcdir <source prefix>]

```

The `--dir` should point to where all the `.xref` files are located.
When OpenEdge creates `.xref` files in these files the full path of the source is stored. To get rid of the unnecessary prefixes use the `--srcdir` parameter to specify what part of the full path should not be displayed.

### `parse`
```
xref parse
```

Parser the current repository.

### search
```
xref search [--field <fieldname>] [--table <tablename>] [--create true|false] [--update true|false] [--delete true|false]
```
Shortcuts:
`--field`, `-f`
`--table`, `-t`
`--create`, `-c`
`--update`, `-u`
`--delete`, `-d`

### switch
```
xref switch <reponame>
```
If multiple repositories are initialized one can switch between them with the switch command


## to do
finish these docs, there's more in there than is described right now.

## disclaimer
Only tested on 11.7.3 Win x64 / Windows 10 so far.