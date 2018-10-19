import { Executable } from '../executable';
import { Help } from '../help';
import * as readline from 'readline';
import { Config } from '../config';
import { XrefFile } from 'xrefparser';

export class MatrixCommand implements Executable {

    private inputFromSources = true;
    private inputFromTables = false;
    private outputJson = false;

    private config: Config;
    private xreffiles: XrefFile[];
    private excludes: string[] = [];

    constructor(config: Config) {
        this.config = config;
        this.xreffiles = this.config.loadRepo(this.config.data.current);
    }

    execute(params: any): Promise<void> {

        const promise = new Promise<void>(async resolve => {

            let inputArray = await this.readStdin();
            inputArray = this.extractExcludes(inputArray);

            if (this.inputFromSources) {
                this.iterateSources(inputArray);
            }
            else if (this.inputFromTables) {
                this.iterateTables(inputArray);
            }

            resolve();
        });

        return promise;
    }

    private extractExcludes(inputArray: string[]): string[] {
        const result: string[] = [];
        inputArray.forEach(line => {
            if (line.startsWith('-') /*|| line.startsWith('+')*/) {
                this.excludes.push(line.substring(1));
             }
             else {
                 result.push(line);
             }
        });

        return result;
    }

    private iterateSources(sourcesArray: Array<string>): void {

        const matrix: { [key: string]: { [key: string]: string} } = {};
        const allTables: Array<string> = [];

        // sort sources first
        sourcesArray = sourcesArray.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
        for (const source of sourcesArray) {

            const tablesOfSource: { [key: string]: string } = {};
            const xreffile = this.xreffiles.filter(item => item.sourcefile === source)[0];
            let sourcename = '';

            if (xreffile !== undefined) {

                for (const table of xreffile.tables) {
                    const crdString =
                        (table.isCreated ? 'C' : ' ') +
                        'R' +
                        (table.isUpdated ? 'U' : ' ') +
                        (table.isDeleted ? 'D' : ' ');
                    tablesOfSource[table.database + '.' + table.name] = crdString;
                    allTables.push(table.database + '.' + table.name);
                }

                sourcename = source;
            }
            else {
                sourcename = source + ' <NOT FOUND>';
            }

            matrix[sourcename] = tablesOfSource;
        }

        let tablenames = [... new Set(allTables)];

        if (this.excludes.length > 0) {
            tablenames = tablenames.filter(table => {
                let includeSource = true;
                this.excludes.forEach(exclude => {
                    if (table.startsWith(exclude)) {
                        includeSource = false;
                    }
                });
                return includeSource;
            });
        }

        tablenames.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);

        this.outputMatrix(matrix, tablenames);

    }

    private iterateTables(tablesArray: Array<string>): void {

        const matrix: { [key: string]: { [key: string]: string} } = {};
        let allsources: string[] = [];
        let sourcesArray: string[] = [];
        const allTables: Array<string> = [];

        tablesArray.forEach(tablename => {
            const files = this.xreffiles.filter(xreffile => {
                const tables = xreffile.tables.filter(table => {
                    return (table.database + '.' + table.name).toLowerCase() === tablename.toLowerCase() ||
                            table.name.toLowerCase() === tablename.toLowerCase();
                });

                return tables.length > 0;
            });
            allsources = allsources.concat(files.map(xfile => xfile.sourcefile));
        });

        sourcesArray = [...new Set(allsources)];

        for (const source of sourcesArray) {

            const tablesOfSource: { [key: string]: string } = {};
            const xreffile = this.xreffiles.filter(item => item.sourcefile === source)[0];
            // let sourcename = '';

            if (xreffile !== undefined) {

                xreffile.tables.forEach(table => {

                    if (tablesArray.indexOf((table.database + '.' + table.name).toLowerCase()) >= 0 ||
                            tablesArray.indexOf((table.name).toLowerCase()) >= 0) {

                        const crdString =
                            (table.isCreated ? 'C' : ' ') +
                            'R' +
                            (table.isUpdated ? 'U' : ' ') +
                            (table.isDeleted ? 'D' : ' ');
                        tablesOfSource[table.database + '.' + table.name] = crdString;
                        allTables.push(table.database + '.' + table.name);
                    }

                });
            }

            matrix[source] = tablesOfSource;

        }

        const tablenames = [... new Set(allTables)];
        tablenames.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);

        // remove excluded sources
        Object.keys(matrix).forEach(key => {
            this.excludes.forEach(exclude => {
                if (key.startsWith(exclude)) {
                    delete matrix[key];
                }
            });
        });

        this.outputMatrix(matrix, tablenames);
    }

    private outputMatrix(matrix: { [key: string]: { [key: string]: string} }, tablenames: string[]) {

        if (this.outputJson) {
            console.log(JSON.stringify(matrix, null, 2));
            return;
        }
        else {
            // output table names first
            let line = '';
            tablenames.forEach(tablename => {
                line += ';' + tablename;
            });

            console.log(line);

            const sourcenames = Object.keys(matrix);
            sourcenames.forEach(source => {
                line = source;
                tablenames.forEach(tablename => {
                    const crud = matrix[source][tablename];
                    line += ';' + ((crud !== undefined) ? crud : '');
                });
                console.log(line);
            });
        }
    }

    private async readStdin(): Promise<Array<string>> {

        const inputArray: Array<string> = [];

        const promise = new Promise<Array<string>>(async resolve => {

            const rl = readline.createInterface({
                input: process.stdin
            });

            rl.on('line', (input) => {
                if (input !== '') {
                    inputArray.push(input);
                }
                else {
                    rl.close();
                    resolve(inputArray);
                }
            });
        });

        return promise;
    }

    validate(params: any): boolean {

        const options = params['options'];

        if (<boolean>options['help'] === true) {
            const help = new Help();
            help.matrixCommand();
            process.exit(0);
        }

        if (<boolean>options['tables'] === true && <boolean>options['sources'] === true) {
            console.error('--tables and --sources options cannot be combined');
            return false;
        }

        if (<boolean>options['sources'] === true) {
            this.inputFromSources = true;
        }

        if (<boolean>options['tables'] === true) {
            this.inputFromTables = true;
            this.inputFromSources = false;  // reset default
        }

        if (<boolean>options['json'] === true) {
            this.outputJson = true;
        }

        return true;
    }
}
