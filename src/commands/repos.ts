import { Config } from './../config';
import { Executable } from './../executable';
import { Help } from '../help';

export class ReposCommand implements Executable {

    private config: Config;
    private verbose = false;
    private json = false;
    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): Promise<void> {

        const promise = new Promise<void>(resolve => {

            const numIndent = 2;

            if (this.json) {
                if (!this.verbose) {
                    console.log(JSON.stringify(this.config.data.repos.map(repo => repo.name), undefined, numIndent));
                }
                else {
                    console.log(JSON.stringify(this.config.data.repos, undefined, numIndent));
                }
            }
            else {
                this.config.data.repos.forEach(repo => {
                    if (!this.verbose) {
                        console.log((repo.name === this.config.data.current ? '*' : '') + repo.name);
                    }
                    else {
                        console.log(`${repo.name}: dir=${repo.dir}` + (repo.srcdir !== undefined ? `, src=${repo.srcdir}` : ''));
                    }
                });
            }
            resolve();
        });

        return promise;
    }

    validate(params: any) {

        const options = params['options'];

        if (<boolean>options['help'] === true) {
            const help = new Help();
            help.reposCommand();
            process.exit(0);
        }

        if (<boolean>options['verbose'] === true) {
            this.verbose = true;
        }

        if (<boolean>options['json'] === true) {
            this.json = true;
        }

        return true;
    }

}
