# OpenEdge XREF CLI
The XREF CLI package gives the possibility to search in OpenEdge `.xref` files via the `xref` command.
The tools is built around repositories. The flow is:

- initialize a repository with `xref init...`
- `xref parse` the directory with `.xref` files
- search for field and table references with `xref search...`

See also `export`, `list` and `show` for all sorts of output.

## help
Use the `xref --help` display a command list. `xref <command> --help` gives help to that particular command.


## disclaimer
Only tested on XREF generated by 11.6 and 11.7.3 (Win x64 / a bit Linux)