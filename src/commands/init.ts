import { Config } from './../config';
import { Executable } from './../executable';
import { Repo } from './../repo';
import * as path from 'path';
import * as fs from 'fs';
import { Help } from '../help';

export class InitCommand implements Executable {

    private config: Config;
    private repo?: Repo;

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): void {

        if (this.repo) {
            this.config.addRepo(this.repo);
            this.config.data.current = this.repo.name;
            console.log(this.repo.name);
        }
    }

    validate(params: any) {

        const options = params['options'];
        if (<boolean>options['help'] === true) {
            const help = new Help();
            help.initCommand();
            process.exit(0);
        }

        const name = <string>options['name'];
        if (name === undefined || name === '') {
            console.error('Error: repo name should supplied');
            return false;
        }

        const dir = <string>options['dir'];
        if (dir === undefined || dir === '') {
            console.error('Error: xref directory (--dir) should be supplied');
            return false;
        }

        if (!fs.existsSync(dir)) {
            console.error(`Error: directory '${dir}' does not exist`);
            return false;
        }

        const dirInfo = fs.lstatSync(dir);
        if (!dirInfo.isDirectory()) {
            console.error(`Error: '${dir}' is not a directory`);
            return false;
        }

        const srcdir = options['srcdir'];
        this.repo = {
            name: name.toLowerCase(),
            dir: dir,
            srcdir: srcdir
        };

        return true;
    }

}
