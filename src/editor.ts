import { Config } from './config';
import { execSync } from 'child_process';
import * as fs from 'fs';

export class Editor {

    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    open(files: string[]) {

        const editor = '\"' + this.config.data.editor.executable + '\"';
        let params = this.config.data.editor.open;

        // add source root to files
        const repo = this.config.getRepo();
        for (let i = 0; i < files.length; i++) {
            files[i] = repo.srcroot + files[i];
        }

        if (!this.validateFiles(files)) {
            console.error('error opening files');
            return;
        }

        params = params.replace('%s', files.join(' '));
        if (repo.srcroot !== undefined) {
            params = params.replace('%r', repo.srcroot);
        }

        const executeString = `${editor} ${params}`;

        try {
            const child = execSync(executeString);
        }
        catch (err) {
            // hide further errors
        }
    }

    private validateFiles(files: string[]): boolean {

        let validationOk = true;
        files.forEach(file => {
            if (!fs.existsSync(file)) {
                console.error(`"${file}" could not be found`);
                validationOk = false;
            }
        });

        return validationOk;
    }
}
