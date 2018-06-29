
import * as path from 'path';
import * as fs from 'fs';
import { Repo } from './repo';
import { XrefFile } from 'xrefparser';
import * as tmp from 'tmp';
import * as inquirer from 'inquirer';
import { CliArgs } from './types';

export class Config {

    data = new ConfigData();

    private configRootDir = '';
    private reposDir = '';
    private configFile = '';
    private tmpDir = '';

    private currentCommand = '';

    async initialize(args: CliArgs): Promise<void> {

        this.currentCommand = args.command;

        const promise = new Promise<void>(async resolve => {
            this.checkDirs();
            const value = await this.loadConfig();
            this.data = value;
            resolve();
        });

        return promise;
    }

    private checkDirs() {

        const userDir = require('os').homedir();
        this.configRootDir = userDir + path.sep + '.xrefcli';
        this.reposDir = this.configRootDir + path.sep + 'repos';
        this.tmpDir = this.configRootDir + path.sep + 'tmp';

        if (!fs.existsSync(this.configRootDir)) {
            fs.mkdirSync(this.configRootDir);
        }

        if (!fs.existsSync(this.reposDir)) {
            fs.mkdirSync(this.reposDir);
        }

        if (!fs.existsSync(this.tmpDir)) {
            fs.mkdirSync(this.tmpDir);
        }
    }

    private async loadConfig(): Promise<ConfigData> {

        const promise = new Promise<ConfigData>(async (resolve, reject) => {

            this.configFile = this.configRootDir + path.sep + 'xrefconfig.json';

            let config = new ConfigData();
            if (fs.existsSync(this.configFile)) {
                config = Object.assign(new ConfigData(), require(this.configFile));
            }

            const validationOk = await this.validateConfig(config);
            if (validationOk) {
                resolve(config);
            }
            else {
                reject();
            }

        });

        return promise;
    }

    private async validateConfig(config: ConfigData): Promise<boolean> {

        const promise = new Promise<boolean>(async resolve => {

            let validationOk = true;
            // if the editor's name is filled, validation takes place
            if (!config.editor.name) {
                validationOk = false;
            }

            if (this.currentCommand === 'search' || this.currentCommand === 'show') {
                await this.askEditorType(config);
            }

            const executable = config.editor.executable;
            if (!executable) {
                console.error('xrefconfig.json: editor "executable" must be specified');
                validationOk = false;
            }

            if (!config.editor.open) {
                config.editor.open = '%s';
            }

            resolve(validationOk);
        });

        return promise;
    }

    private async askEditorType(config: ConfigData): Promise<void> {

        const promise = new Promise<void>(async resolve => {

            const type = config.editor.type;
            if (type !== 'gui' && type !== 'cli') {
                const prompt = inquirer.createPromptModule();
                const answer = await prompt({
                    name: 'type',
                    type: 'list',
                    message: 'Editor type is not specified, what UI do you want?',
                    choices: ['gui', 'cli']
                });
                config.editor.type = <'cli' | 'gui'>(<{ type: string }>answer).type;
            }
            resolve();

        });
        return promise;
    }

    saveConfig() {
        fs.writeFileSync(this.configFile, JSON.stringify(this.data, null, 2));
    }

    addRepo(repo: Repo): void {

        if (this.data.repos.findIndex(item => item.name === repo.name) === -1) {
            this.data.repos.push(repo);
        }
    }

    removeRepo(reponame: string) {
        reponame = reponame.toLowerCase();
        if (this.data.repos.findIndex(item => item.name === reponame) === -1) {
            console.error(`Error: repo '${reponame}' not found`);
            process.exit(1);
        }
        const repofile = this.getRepoFilename(reponame);
        fs.unlinkSync(repofile);
        this.data.repos = this.data.repos.filter(item => item.name !== reponame);
    }

    repoExists(reponame: string): boolean {
        return (this.data.repos.findIndex(item => item.name === reponame) !== -1);
    }

    writeRepoData(reponame: string, xrefdata: any): boolean {

        const repofilename = this.getRepoFilename(reponame);
        fs.writeFileSync(repofilename, JSON.stringify(xrefdata, undefined, 2));

        return true;
    }

    getRepo(reponame = ''): Repo {

        if (reponame === '') {
            reponame = this.data.current;
        }

        const repo = this.data.repos.filter(item => item.name === reponame.toLowerCase())[0];
        return repo;
    }

    private getRepoFilename(reponame: string) {
        const repofilename = this.reposDir + path.sep + reponame + '.json';
        return repofilename;
    }

    loadRepo(reponame: string): XrefFile[] {
        const repofile = this.getRepoFilename(reponame);
        const xreffile = require(repofile);
        return xreffile;
    }

    writeTmpFile(content: string, postfix = '.tmp'): string {

        const tmpFilename = tmp.tmpNameSync({
            dir: this.tmpDir,
            postfix: postfix
        });

        fs.writeFileSync(tmpFilename, content);

        return tmpFilename;
    }
}

export class ConfigData {
    current = '';
    editor = new EditorConfig();
    repos: Repo[] = [];
}

export class EditorConfig {
    name = '';
    type: 'gui' | 'cli' | '' = '';
    executable = '';
    open = '';
}
