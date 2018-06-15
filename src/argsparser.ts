import { CliArgs } from './types';
import { OptionDefinition } from 'command-line-args';

export class ArgsParser {

    private nameDefinition: OptionDefinition = { name: 'name', alias: 'n', defaultOption: true };

    parse(): CliArgs {

        const commandLineArgs = require('command-line-args');

        let optionDefs: OptionDefinition[] = [];

        const mainDefinitions = [
            { name: 'command', defaultOption: true }
        ];

        const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });
        const argv = mainOptions._unknown || [];

        // console.log('mainOptions\n===========');
        // console.log(mainOptions);

        let options = {};

        switch (mainOptions.command) {

            case 'init':
                optionDefs = this.initOptions(optionDefs);
                break;

            case 'list':
                optionDefs = [ { name: 'json', type: Boolean } ];
                break;

            case 'remove':
                optionDefs = this.removeOptions(optionDefs);
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
        optionDefs.push({ name: 'srcBase', alias: 's' });
        return optionDefs;
    }

    private removeOptions(optionDefs: OptionDefinition[]): OptionDefinition[] {
        optionDefs.push(this.nameDefinition);
        return optionDefs;
    }

    private switchOptions(optionDefs: OptionDefinition[]): OptionDefinition[] {
        optionDefs.push(this.nameDefinition);
        return optionDefs;
    }

}
