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
            console.log(JSON.stringify(this.config.data.repos));
        }
        else {
            this.config.data.repos.forEach(repo => {
                console.log(repo);
            });
        }
    }

    validate(params: any) {
        return true;
    }

}
