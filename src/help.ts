
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
                header: 'Command list',
                content: [
                    { name: 'about', summary: 'Displays information about version/author etc ' },
                    { name: 'init', summary: 'Initializes repo' },
                    { name: 'list', summary: 'List the available repos' },
                    { name: 'parse', summary: 'Parses .xref files of repo' },
                    { name: 'remove', summary: 'Removes a repo'},
                    { name: 'search', summary: 'Searches a repo for field/table etc references'},
                    { name: 'show', summary: 'Shows info about a source file'},
                    { name: 'switch', summary: 'Switches the default repo'},
                    { name: 'validate', summary: 'Runs some (crude) validations on the repo'}
                  ]
            }
        ];
        const usage = this.commandLineUsage(this.sections);
        console.log(usage);
    }
}
