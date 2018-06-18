# OpenEdge XREF CLI
The XREF CLI package gives the possibility to search in OpenEdge `.xref` files via the `xref` command.
The tools is built around repositories. The flow is:

- initialize a repository with `xref init...`
- `xref parse` the directory with `.xref` files
- search for field and table references with `xref search...`


## `xref` commands

### `init`
```
xref init <reponame> --dir <xref file dir> [--srcdir <source prefix>]

```

Initializes a repo (for XREF information) under the name `<reponame>`
The `--dir` should point to where all the `.xref` files are located.
When OpenEdge creates `.xref` files in these files the full path of the source is stored. To get rid of the unnecessary prefixes use the `--srcdir` parameter to specify what part of the full path should not be displayed.

```
xref init tst1 --dir /tmp/xref --srcdir /home/xyz/development/src
```

Initializes the `tst1` repo, specfies that the xref files are in `/tmp/xref` and make sure that all the refences to source file do not contain `/home/xyz/development/src`. See `xref parse` for processing the xref files.

Display the repositories. Without parameters just the names are displayed.

### `parse`
```
xref parse
```

Parse the current repository.

### `remove`
```
xref remove <reponame>
```

Removes the repository

### `repos`
```
xref repos [--verbose ] [--json]
```
`--verbose` display all the information on the repos
`--json`    diplay info in JSON format

### `search`
```
xref search [--field <fieldname>] [--table <tablename>] [--db <dbname>] [--create true|false] [--update true|false] [--delete true|false]
```

Searches the current repository for references in sources of either field, table or databases. `--field` and `--table` can be combined.

```
xref search --field custnum --table order --update false
```
Search for references `customer.custnum` which are not updated.

### `show`
```
xref show <sourcename> [--xref] [--table] [--json]
```

If `--xref` is specified the original XREF file content is showed. For example:
```
xref show src/customer.cls --xref | grep -i custnum
```
will show all the original xref lines with custnum in it.

The `--table` option shows the tables accessed on way or another by `<sourcename>`. When `--tables` is used, the output can be JSON as well by adding `--json`.

If neither `--xref` nor `--tables` is specified then the JSON about the `<sourcename>` in the current repo is showed.

### `switch`
```
xref switch <reponame>
```
If multiple repositories are initialized one can switch between them with the switch command


## to do
finish these docs, there's more in there than is described right now.

## disclaimer
Only tested on 11.7.3 (Win x64 / a bit Linux)