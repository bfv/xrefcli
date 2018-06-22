
import { Section } from 'command-line-usage';


export class Help {

    commandLineUsage = require('command-line-usage');
    sections: Section[] = [];

    main() {
        this.sections = [
            {
                header: 'XREFCLI',
                content: 'OpenEdge xref via CLI'
            },
            {
                header: 'Synopsis',
                content: 'xref <command> <options>'
            },
            {
                header: 'Commands',
                content: [
                    { name: 'about', summary: 'Displays information about version/author etc ' },
                    { name: 'export', summary: 'Exports source/table usage to CSV' },
                    { name: 'init', summary: 'Initializes repo' },
                    { name: 'parse', summary: 'Parses .xref files of repo' },
                    { name: 'remove', summary: 'Removes a repo' },
                    { name: 'repos', summary: 'List the available repos' },
                    { name: 'search', summary: 'Searches a repo for field/table etc references' },
                    { name: 'show', summary: 'Shows info about a source file' },
                    { name: 'switch', summary: 'Switches the default repo' },
                    { name: 'validate', summary: 'Runs some (crude) validations on the repo' }
                ]
            },
            {
                header: 'Standard options',
                content: [
                    '--help, -h    Displays help, use xref <command> --help for help on command',
                    '--name, -n    Specify repo name, valid for all but about, list, repo and show'
                ]
            }
        ];
        const usage = this.commandLineUsage(this.sections);
        console.log(usage);
    }

    aboutCommand() {
        this.sections = [
            {
                header: 'XREFCLI - about command',
                content: 'Display about on XREFCLI'
            },
            {
                header: 'Synopsis',
                content: 'xref about'
            }
        ];
        const usage = this.commandLineUsage(this.sections);
        console.log(usage);
    }

    exportCommand() {

        this.sections = [
            {
                header: 'XREFCLI - export command',
                content: 'Export CSV data on source/table usage'
            },
            {
                header: 'Synopsis',
                content: 'xref export --outfile <filename> <options>'
            },
            {
                header: 'Options',
                content: [
                    '--outfile, -o         File for output',
                    '--includeempty, -i    Include source w/o db references'
                ]
            }
        ];
        const usage = this.commandLineUsage(this.sections);
        console.log(usage);
    }

    initCommand() {

        this.sections = [
            {
                header: 'XREFCLI - init command',
                content: 'Initialize repo'
            },
            {
                header: 'Synopsis',
                content: 'xref init [--name] <reponame> <options>'
            },
            {
                header: 'Options',
                content: [
                    '--dir, -d       Directory containing OE .xref files',
                    '--srcdir, -s    Directory name to be removed from all source references'
                ]
            }
        ];
        const usage = this.commandLineUsage(this.sections);
        console.log(usage);
    }

    listCommand() {

        this.sections = [
            {
                header: 'XREFCLI - list command',
                content: 'List tables/databases in repo'
            },
            {
                header: 'Synopsis',
                content: 'xref list [ [--tables] | [--dbs] ] [--json]'
            },
            {
                header: 'Options',
                content: [
                    '--tables, t       (default) display all tables used',
                    '--dbprefix, -p    Indicates if output of table names should be prefixed with database name',
                    '--dbs, -d         List all used databases (aliases)',
                    '--json            Output in JSON format, disregards the --dbprefix setting'
                ]
            }
        ];

        const usage = this.commandLineUsage(this.sections);
        console.log(usage);
    }

    reposCommand() {
        this.sections = [
            {
                header: 'XREFCLI - repos command',
                content: 'Display repos'
            },
            {
                header: 'Synopsis',
                content: 'xref repos <options>'
            },
            {
                header: 'Options',
                content: [
                    '--verbose, -v   Displays verbose information about the repos',
                    '--json          output in JSON'
                ]
            }
        ];
        const usage = this.commandLineUsage(this.sections);
        console.log(usage);
    }

    searchCommand() {
        this.sections = [
            {
                header: 'XREFCLI - search command',
                content: 'Search for field and table references in repo'
            },
            {
                header: 'Synopsis',
                content: 'xref search [ --field <fieldname>] [--table <tablename] [--db <dbname>] ' +
                    '[--create [true | false] [--update [true | false]] [--delete [true | false]'
            },
            {
                header: 'Options',
                content: [
                    '--field, -f      search for field references',
                    '--table, -t      search for table references (can be combined with --field)',
                    '--db             search for sources accessing <dbname>',
                    '--create, -c     filter on whether the --table is created (default: true)',
                    '--delete, -d     see --create, only for deletes',
                    '--update, -u     filter on whether the --field is updated (default: true)',
                    '--batch, -b      omit result count'
                ]
            },
            {
                header: 'Examples',
                content: [
                    'xref search --field custum --table customer --update',
                    '  search for source which update customer.custnum field',
                    ' ',
                    'xref search --table order --create',
                    '  search for sources which create customer records'
                ]
            }
        ];

        const usage = this.commandLineUsage(this.sections);
        console.log(usage);
    }
}
