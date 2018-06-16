import { CliArgs } from './types';
import { OptionDefinition } from 'command-line-args';
import { Help } from './help';

export class ArgsParser {

    private nameDefinition: OptionDefinition = { name: 'name', alias: 'n', defaultOption: true };
    private jsonDefinition: OptionDefinition = { name: 'json', type: Boolean };
    private helpDefinition: OptionDefinition = { name: 'help', type: Boolean };

    parse(): CliArgs {

        const commandLineArgs = require('command-line-args');

        let optionDefs: OptionDefinition[] = [];

        const helpMainDefinitions = [
            { name: 'help', alias: 'h', type: Boolean, defaultOption: true }
        ];

        try {
            const helpOptions = commandLineArgs(helpMainDefinitions, { stopAtFirstUnknown: false });
            if (helpOptions['help'] === true) {
                this.help();
                process.exit(0);
            }
        }
        catch (e) {
            // hide errors
        }

        const mainDefinitions = [
            { name: 'command', defaultOption: true }
        ];

        const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });
        const argv = mainOptions._unknown || [];

        if (mainOptions['command'] === undefined) {
            this.help();
        }

        let options = {};

        switch (mainOptions.command) {

            case 'init':
                optionDefs = this.initOptions(optionDefs);
                break;

            case 'list':
                optionDefs = this.listOptions(optionDefs);
                break;

            case 'parse':
                optionDefs = this.parseOptions(optionDefs);
                break;

            case 'remove':
                optionDefs = this.removeOptions(optionDefs);
                break;

            case 'search':
                optionDefs = this.searchOptions(optionDefs);
                break;

            case 'show':
                optionDefs = this.showOptions(optionDefs);
                break;

            case 'switch':
                optionDefs = this.switchOptions(optionDefs);
                break;
        }

        options = commandLineArgs(optionDefs, { argv });

        return {
            command: mainOptions.command,
            options: options
        };
    }

    private initOptions(optionDefs: OptionDefinition[]): OptionDefinition[] {
        optionDefs.push(this.nameDefinition);
        optionDefs.push({ name: 'dir', alias: 'd' });
        optionDefs.push({ name: 'srcdir', alias: 's' });
        return optionDefs;
    }

    private listOptions(optionDefs: OptionDefinition[]): OptionDefinition[] {
        optionDefs.push(this.jsonDefinition);
        optionDefs.push({ name: 'indent', alias: 'i', type: Boolean });
        optionDefs.push({ name: 'verbose', alias: 'v', type: Boolean });
        return optionDefs;
    }

    private parseOptions(optionDefs: OptionDefinition[]): OptionDefinition[] {
        optionDefs.push(this.nameDefinition);
        return optionDefs;
    }

    private removeOptions(optionDefs: OptionDefinition[]): OptionDefinition[] {
        optionDefs.push(this.nameDefinition);
        return optionDefs;
    }

    private searchOptions(optionDefs: OptionDefinition[]): OptionDefinition[] {
        optionDefs.push(this.nameDefinition);
        optionDefs.push({ name: 'field', alias: 'f' });
        optionDefs.push({ name: 'table', alias: 't' });
        optionDefs.push({ name: 'create', alias: 'c' });
        optionDefs.push({ name: 'update', alias: 'u' });
        optionDefs.push({ name: 'delete', alias: 'd' });
        optionDefs.push(this.jsonDefinition);
        optionDefs.push({ name: 'batch', alias: 'b', type: Boolean });  // batch, no count in results
        return optionDefs;
    }

    private showOptions(optionDefs: OptionDefinition[]): OptionDefinition[] {
        optionDefs.push({ name: 'source', alias: 's', defaultOption: true });
        optionDefs.push({ name: 'tables', alias: 't', type: Boolean });
        optionDefs.push(this.jsonDefinition);
        optionDefs.push({ name: 'xref', alias: 'x', type: Boolean });
        return optionDefs;
    }

    private switchOptions(optionDefs: OptionDefinition[]): OptionDefinition[] {
        optionDefs.push(this.nameDefinition);
        return optionDefs;
    }

    private help() {
        const help = new Help();
        help.main();
        process.exit(0);
    }

}
