import { Config } from './../config';
import { Executable } from './../executable';
import * as fs from 'fs';
import { Help } from '../help';
import { Editor } from '../editor';
import { XrefFile } from 'xrefparser';

export class ShowCommand implements Executable {

    config: Config;
    source = '';
    tables = false;
    jsonOutput = false;
    xrefOutput = false;
    openFile = false;

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): Promise<void> {

        const promise = new Promise<void>(resolve => {

            const xreffiles = this.config.loadRepo(this.config.data.current);
            const xreffile = xreffiles.filter(item => item.sourcefile === this.source)[0];

            if (xreffile === undefined) {
                console.error(`source '${this.source}' not in repo '${this.config.data.current}'`);
            }
            else {
                if (this.openFile) {
                    this.openEditor(xreffile);
                }
                else {
                    this.generateOutput(xreffile);
                }
            }
            resolve();
        });

        return promise;
    }

    validate(params: any) {

        const options = params['options'];

        if (<boolean>options['help'] === true) {
            const help = new Help();
            help.showCommand();
            process.exit(0);
        }

        const source = <string>options['source'];
        if (source === undefined) {
            console.error('Error: a source name should be provided');
            return false;
        }

        this.source = source;

        const tables = <boolean>options['tables'];
        if (tables === true) {
            this.tables = true;
        }

        if ((<boolean>options['json']) === true) {
            this.jsonOutput = true;
        }

        if ((<boolean>options['xref']) === true) {
            this.xrefOutput = true;
        }

        if ((<boolean>options['open']) === true) {
            this.openFile = true;
        }

        return true;
    }

    private openEditor(xreffile: XrefFile) {
        const editor = new Editor(this.config);
        if (this.xrefOutput) {
            editor.open([xreffile.xreffile]);
        }
        else {
            editor.openContent(JSON.stringify(xreffile, undefined, 2));
        }
    }

    private generateOutput(xreffile: XrefFile) {

        if (this.xrefOutput) {
            const content = fs.readFileSync(xreffile.xreffile);
            console.log(content.toString());
        }
        else {
            if (!this.tables) {
                console.log(JSON.stringify(xreffile, undefined, 2));
            }
            else {
                if (this.jsonOutput) {
                    console.log(JSON.stringify(xreffile.tablenames, undefined, 2));
                }
                else {
                    xreffile.tablenames.forEach(table => {
                        console.log(table);
                    });
                }
            }
        }

    }

}
