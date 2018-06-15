import { Executable } from '../executable';
import { Config } from '../config';
import { Repo } from '../repo';
import { Parser } from 'xrefparser';
import * as fs from 'fs';

export class ParseCommand implements Executable {

    private config: Config;
    private reponame = '';

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): void {
        this.parse(this.reponame);
    }

    parse(reponame: string) {

        const repo = this.config.getRepo(reponame);

        const parser = new Parser();
        const xrefdata = parser.parseDir(repo.dir, repo.srcdir);

        if (xrefdata !== undefined) {
            this.config.writeRepoData(repo.name, xrefdata);
        }
    }

    validate(params: any) {

        const options = params['options'];
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
