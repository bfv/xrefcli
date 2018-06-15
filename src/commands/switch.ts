import { Config } from './../config';
import { Executable } from './../executable';

export class SwitchCommand implements Executable {

    config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): void {
        const name = <string>params['options']['name'];

        if (name !== undefined) {
            if (this.config.repoExists(name)) {
                this.config.data.current = name;
                console.log(name);
            }
            else {
                console.error(`Error: repo ${name} doesn't not exist`);
                process.exit(1);
            }
        }
        else {
            console.log(this.config.data.current);
        }
    }

    validate(params: any) {
        return true;
    }
}
