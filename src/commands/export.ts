import { Executable } from './../executable';
import { Config } from '../config';
import { Searcher, XrefFile } from 'xrefparser';
import * as fs from 'fs';
import { WriteStream } from 'fs';

export class ExportCommand implements Executable {

    private config: Config;
    private reponame = '';
    private outfile = '';
    private searcher: Searcher;
    private xreffiles: XrefFile[] = [];
    private includeEmpty = false;

    constructor(config: Config) {
        this.config = config;
        this.reponame = this.config.data.current;
        this.searcher = new Searcher();
    }

    execute(params: any): Promise<void> {

        this.xreffiles = this.config.loadRepo(this.reponame);
        this.searcher.add(this.xreffiles);

        const promise = new Promise<void>((resolve, reject) => {
            this.outputSourceTable().then(() => {
                resolve();
            });
        });

        return promise;
    }

    validate(params: any) {

        const options = params['options'];

        const reponame = <string>options['name'];
        if (reponame === null) {
            console.error('Error: a repo name should be provided');
            return false;
        }
        if (reponame !== undefined) {

            if (!this.config.repoExists(reponame)) {
                console.error(`Error: repo '${reponame}' does not exist`);
                return false;
            }
            this.reponame = reponame;
        }

        const outfile = <string>options['outfile'];
        if (outfile === null || outfile === undefined) {
            console.error('Error: --outfile must be specified');
            return false;
        }
        this.outfile = outfile;

        if (<boolean>options['includeempty'] === true) {
            this.includeEmpty = true;
        }

        return true;
    }

    private async outputSourceTable() {

        this.xreffiles.sort((a, b) => a.sourcefile.toLowerCase() < b.sourcefile.toLowerCase() ? -1 : 1);

        const writeStream = fs.createWriteStream(this.outfile);

        let tablenames = this.searcher.getTableNames().map(table => table.table);
        tablenames = [...new Set(tablenames)];
        tablenames.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);

        const header = [' ', ...tablenames];
        this.writeLine(writeStream, header);

        for (let x = 0; x < this.xreffiles.length; x++) {

            const currentXreffile = this.xreffiles[x];
            const tables = new Array<string>(tablenames.length + 1);

            tables[0] = currentXreffile.sourcefile;

            let count = 0;
            for (let i = 0; i < tablenames.length; i++) {
                const currentTablename = tablenames[i];
                const pos = currentXreffile.tablenames.findIndex(tablename => tablename === currentTablename);
                if (pos >= 0) {
                    tables[i + 1] = 'X';
                    count++;
                }
                else {
                    tables[i + 1] = ' ';
                }
            }

            // skip sources without db access, if no -i parameters given
            if (count > 0 || this.includeEmpty) {
                await this.writeLine(writeStream, tables);
            }
        }

        writeStream.end();
    }

    async writeLine(writeStream: fs.WriteStream, line: string[]) {

        let lineOut = '';
        line.forEach(element => {
            lineOut += `"${element}";`;
        });
        lineOut = lineOut.substring(0, lineOut.length - 1) + '\n';

        const promise = new Promise((resolve, reject) => {
            writeStream.write(lineOut, () => {
                resolve();
            });
        });

        await promise;
    }
}
