
import * as path from 'path';
import * as fs from 'fs';
import { Repo } from './repo';
import { XrefFile} from 'xrefparser';

export class Config {

    data = new ConfigData();

    private configRootDir = '';
    private reposDir = '';
    private configFile = '';

    initialize() {
        this.checkDirs();
        this.data = this.loadConfig();
    }

    private checkDirs() {

        const userDir = require('os').homedir();
        this.configRootDir = userDir + path.sep + '.xrefcli';
        this.reposDir = this.configRootDir + path.sep + 'repos';

        if (!fs.existsSync(this.configRootDir)) {
            fs.mkdirSync(this.configRootDir);
        }

        if (!fs.existsSync(this.reposDir)) {
            fs.mkdirSync(this.reposDir);
        }
    }

    private loadConfig(): ConfigData {

        this.configFile = this.configRootDir + path.sep + 'xrefconfig.json';

        let config = new ConfigData();
        if (fs.existsSync(this.configFile)) {
            config = require(this.configFile);
        }

        return config;
    }

    saveConfig() {
        fs.writeFileSync(this.configFile, JSON.stringify(this.data, null, 4));
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

    getRepo(reponame: string): Repo {
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
}

export class ConfigData {
    current = '';
    repos: Repo[] = [];
}


