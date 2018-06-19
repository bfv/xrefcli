import { Config } from './../config';
import { Executable } from './../executable';
import { Help } from '../help';

export class ReposCommand implements Executable {

    config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): void {

        const options = params['options'];
        if (<boolean>options['help'] === true) {
            const help = new Help();
            help.reposCommand();
            process.exit(0);
        }

        const name = <string> options['name'];
        const verbose = <boolean> options['verbose'];

        const numIndent = 2;

        if (<boolean>params['options']['json']) {
            if (!verbose) {
                console.log(JSON.stringify(this.config.data.repos.map(repo => repo.name), undefined, numIndent));
            }
            else {
                console.log(JSON.stringify(this.config.data.repos, undefined, numIndent));
            }
        }
        else {
            this.config.data.repos.forEach(repo => {
                if (!verbose) {
                    console.log((repo.name === this.config.data.current ? '*' : '') + repo.name);
                }
                else {
                    console.log(`${repo.name}: dir=${repo.dir}` + (repo.srcdir !== undefined ? `, src=${repo.srcdir}` : ''));
                }
            });
        }
    }

    validate(params: any) {
        return true;
    }

}
