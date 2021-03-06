# Release notes XREFCLI

## 2.8.0
- #21 added searching for includes

## 2.7.0
- implemented --tables & --json parameters
- added excludes for --tables option

## 2.6.1
- corrected errors previous deploy

## 2.6.0
- #23 added matrix command

## 2.5.3
- handled unknown options error
- Execute.validate now returns boolean

## 2.5.2
- errorneuos publish

## 2.5.1
- #22 added [CUD] to output of `show --tables`

## 2.5.0
- updated xprefparser dependency to 3.0.4 (sequence fix)

## 2.4.3
- incorrect code pushed to npm

## 2.4.2
- linked correctly from README.md to editor.md

## 2.4.1
- removed editor validation from config validate

## 2.4.0
- bumped `xrefparser` to 2.1.0
- commands are now async
- bugs fixes

## 2.3.0
- interactive setup for editor type
- bumped `xrefparser` to 1.0.0 (for bugfix)
- stream lined some async handling
- removed `process.exit(0);` from happy flow

## 2.2.0
- added CLI support for viewing files in CLI

## 2.1.1
- removed vscode specific constructs

## 2.1.0
- added `--open` option to `show` command

## 2.0.1
- added release notes
- added validation for opening editor
- removed asynchronous constructor for opening editor
- moved option handling to validate()

## 2.0.0
- added opening sources found by `search`

## 1.0.0
First "true" version