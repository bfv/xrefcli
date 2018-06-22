import { Config } from './../config';
import { Executable } from './../executable';
import { Help } from '../help';

export class RemoveCommand implements Executable {

    config: Config;
    reponame = '';

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): void {

        this.config.removeRepo(this.reponame);
        this.config.data.current = '';
        console.log(this.reponame);
    }

    validate(params: any) {

        const options = params['options'];

        if (<boolean>options['help'] === true) {
            const help = new Help();
            help.removeCommand();
            process.exit(0);
        }

        const reponame = <string> options['name'];
        if (reponame === undefined) {
            console.error('Error: a repo name should be provided');
            return false;
        }

        if (!this.config.repoExists(reponame)) {
            console.error(`Error: repo '${reponame}' does not exist`);
            return false;
        }

        this.reponame = reponame;

        return true;
    }

}
