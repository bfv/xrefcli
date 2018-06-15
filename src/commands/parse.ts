import { Executable } from '../executable';
import { Config } from '../config';
import { Repo } from '../repo';

export class ParseCommand implements Executable {

    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): void {

    }

    parse(repo: Repo) {

    }

    validate(params: any) {
        return true;
    }
}
