import { Config } from './../config';
import { Executable } from './../executable';

export class ListCommand implements Executable {

    config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): void {
        const name = <string>params['options']['name'];

        if (<boolean>params['options']['json']) {
            console.log(JSON.stringify(this.config.config.repos));
        }
        else {
            this.config.config.repos.forEach(repo => {
                console.log(repo);
            });
        }
    }

}
