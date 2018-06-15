import { Config } from './../config';
import { Executable } from './../executable';

export class RemoveCommand implements Executable {

    config: Config;
    reponame = '';

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): void {

        this.config.removeRepo(name);
        this.config.data.current = '';
        console.log(name);
    }

    validate(params: any) {

        const options = params['options'];
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
