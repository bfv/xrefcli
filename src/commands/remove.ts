import { Config } from './../config';
import { Executable } from './../executable';

export class RemoveCommand implements Executable {

    config: Config;

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
        const name = <string> options['name'];

        if (name === undefined) {
            console.error('Error: a name should be provided');
            return false;
        }

        return true;
    }

}
