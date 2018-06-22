import { Config } from './../config';
import { Executable } from './../executable';
import { Help } from '../help';

export class SwitchCommand implements Executable {

    private config: Config;
    private reponame = '';

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any) {
        this.config.data.current = this.reponame;
        console.log(this.reponame);
    }

    validate(params: any) {

        const options = params['options'];

        if (<boolean>options['help'] === true) {
            const help = new Help();
            help.switchCommand();
            process.exit(0);
        }

        const name = <string>options['name'];

        if (name !== undefined) {
            if (!this.config.repoExists(name)) {
                console.error(`Error: repo ${name} doesn't not exist`);
                return false;
            }
        }
        this.reponame = name;

        return true;
    }
}
