import { Executable } from '../executable';
import { Config } from '../config';
import { Repo } from '../repo';
import { Parser } from 'xrefparser';
import * as fs from 'fs';
import { Help } from '../help';

export class ParseCommand implements Executable {

    private config: Config;
    private reponame = '';

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): Promise<void> {

        const promise = new Promise<void>(resolve => {
            this.parse(this.reponame);
            resolve();
        });
        return promise;
    }

    parse(reponame: string) {

        const repo = this.config.getRepo(reponame);

        const t1 = (new Date()).getTime();

        const parser = new Parser();
        const xrefdata = parser.parseDir(repo.dir, repo.srcdir);

        const t2 = (new Date()).getTime();

        if (xrefdata !== undefined) {
            this.config.writeRepoData(repo.name, xrefdata);
        }

        console.log(`elapsed: ${t2 - t1}ms`);
    }

    validate(params: any) {

        const options = params['options'];

        if (<boolean>options['help'] === true) {
            const help = new Help();
            help.parseCommand();
            process.exit(0);
        }

        let reponame = options['name'];
        if (reponame === undefined) {
            if (this.config.data.current === undefined) {
                console.error('Error: no repo specified, no current repo');
                return false;
            }
            else {
                reponame = this.config.data.current;
            }
        }

        this.reponame = reponame;

        return true;
    }
}
