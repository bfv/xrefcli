
import * as path from 'path';
import * as fs from 'fs';
import { Repo } from './repo';
import { XrefFile} from 'xrefparser';
import * as tmp from 'tmp';
import { exec } from 'child_process';

export class Config {

    data = new ConfigData();

    private configRootDir = '';
    private reposDir = '';
    private configFile = '';
    private tmpDir = '';

    initialize() {
        this.checkDirs();
        this.data = this.loadConfig();
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

    private loadConfig(): ConfigData {

        this.configFile = this.configRootDir + path.sep + 'xrefconfig.json';

        let config = new ConfigData();
        if (fs.existsSync(this.configFile)) {
            config = Object.assign(new ConfigData(), require(this.configFile));
        }

        if (!this.validateConfig(config)) {
            process.exit(1);
        }

        return config;
    }

    private validateConfig(config: ConfigData): boolean {

        let validationOk = true;
        if (config.editor) {
            // if the editor's name is filled, validation takes place
            if (config.editor.name) {

                const type = config.editor.type;
                if (type !== 'gui' && type !== 'cli') {
                    console.error('xrefconfig.json: editor "type" must be either "gui" or "cli"');
                    validationOk = false;
                }

                const executable = config.editor.executable;
                if (!executable) {
                    console.error('xrefconfig.json: editor "executable" must be specified');
                    validationOk = false;
                }

                if (!config.editor.open) {
                    config.editor.open = '%s';
                }
            }
        }

        return validationOk;
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
    editor?: EditorConfig = {};
    repos: Repo[] = [];
}

export class EditorConfig {
    name?: string;
    type?: 'gui' | 'cli';
    executable?: string;
    open?: string;
}
