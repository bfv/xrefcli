import { Config } from './../config';
import { Executable } from './../executable';

export class RemoveCommand implements Executable {

    config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): void {
        const name = <string>params['options']['name'];
        this.config.removeRepo(name);
        this.config.data.current = '';
        console.log(name);
    }

    validate(params: any) {
        return true;
    }

}
