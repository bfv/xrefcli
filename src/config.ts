
import * as path from 'path';
import * as fs from 'fs';

export class Config {

    config = new ConfigData();

    private configRootDir = '';
    private reposDir = '';
    private configFile = '';

    initialize() {
        this.checkDirs();
        this.config = this.loadConfig();
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
        fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 4));
    }

    addRepo(reponame: string): void {
        reponame = reponame.toLowerCase();
        if (this.config.repos.findIndex(item => item === reponame) === -1) {
            this.config.repos.push(reponame);
        }
    }

    removeRepo(reponame: string) {
        reponame = reponame.toLowerCase();
        if (this.config.repos.findIndex(item => item === reponame) === -1) {
            console.error(`Error: repo '${reponame}' not found`);
            process.exit(1);
        }
        this.config.repos = this.config.repos.filter(name => name !== reponame);
    }

    repoExists(reponame: string): boolean {
        return (this.config.repos.findIndex(item => item === reponame) !== -1);
    }
}

export class ConfigData {
    current = '';
    repos: string[] = [];
}


