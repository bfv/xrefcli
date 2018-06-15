import { Config } from './../config';
import { Executable } from './../executable';

export class InitCommand implements Executable {

    config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): void {
        const name = <string>params['options']['name'];
        this.config.addRepo(name);
        this.config.config.current = name;
        console.log(name);
    }

}
