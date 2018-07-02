import { Config, EditorConfig } from './config';
import * as child_process from 'child_process';
import * as fs from 'fs';

export class Editor {

    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    open(files: string[]) {

        const editconfig = this.config.data.editor;

        if (editconfig === undefined) {
            return;
        }

        this.validateConfig(editconfig).then(validationOk => {

            if (!validationOk) {
                return;
            }

            // add source root to files
            const repo = this.config.getRepo();

            if (!this.validateFiles(files)) {
                console.error('error opening files');
                return;
            }

            let params = editconfig.open || '%s';
            params = params.replace('%s', files.join(' '));

            if (repo.srcroot !== undefined) {
                params = params.replace('%r', repo.srcroot);
            }

            try {
                if (editconfig.type === 'cli') {
                    const editor = editconfig.executable || '';
                    const child = child_process.spawnSync(editor, [params], {
                        stdio: 'inherit'
                    });
                    if (child.error) {
                        console.log(child.error);
                    }
                }
                else {
                    const editor = '\"' + editconfig.executable + '\"';
                    const executeString = `${editor} ${params}`;
                    const child = child_process.execSync(executeString);
                }

            }
            catch (err) {
                // hide further errors
            }

        });


    }

    openContent(content: string) {

        const editconfig = this.config.data.editor;

        if (editconfig === undefined) {
            return;
        }

        this.validateConfig(editconfig).then(validationOk => {

            if (!validationOk) {
                return;
            }

            const filename = this.config.writeTmpFile(content, '.json');

            let params = editconfig.open || '%s';
            params = params.replace('%r', '');
            params = params.replace('%s', `${filename}`);

            if (editconfig.type === 'cli') {

                const child = child_process.spawnSync(editconfig.executable || 'view', [filename], {
                    stdio: 'inherit'
                });
                if (child.error) {
                    console.log(child.error);
                }

            }
            else {
                child_process.execSync(`"${editconfig.executable}" ${params}`);
            }

        });
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

    private async validateConfig(editconfig: EditorConfig | undefined): Promise<boolean> {

        const promise = new Promise<boolean>(async resolve => {

            let validationOk = true;

            if (editconfig === undefined || !editconfig.executable || !editconfig.open) {
                console.error('editor not configured');
                if (editconfig && !editconfig.executable) {
                    console.error('  set "executable" property');
                }
                if (editconfig && !editconfig.open) {
                    console.error('  set "open" property');
                }
                validationOk = false;
            }

            if (validationOk) {
                await this.checkEditor();
            }

            resolve(validationOk);
        });

        return promise;
    }

    private async checkEditor() {
        await this.config.askEditorType(this.config.data);
    }
}
