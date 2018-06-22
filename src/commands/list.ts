import { Config } from './../config';
import { Executable } from './../executable';
import { XrefFile, Searcher } from 'xrefparser';
import { Help } from '../help';


export class ListCommand implements Executable {

    private config: Config;

    private xreffiles: XrefFile[] = [];
    private searcher: Searcher;

    private outputJson = false;
    private dbPrefix = false;
    private outputType: 'tables' | 'dbs' = 'tables';

    constructor(config: Config) {
        this.config = config;
        this.searcher = new Searcher();
    }

    execute(params: any): void {

        this.xreffiles = this.config.loadRepo(this.config.data.current);
        this.searcher.add(this.xreffiles);

        switch (this.outputType) {

            case 'tables':
                this.outputTables();
                break;
            case 'dbs':
                this.outputDatabases();
                break;
        }

    }

    validate(params: any) {

        const options = params['options'];

        if (<boolean>options['help'] === true) {
            const help = new Help();
            help.listCommand();
            process.exit(0);
        }

        if (<boolean>options['tables'] === true && <boolean>options['dbs'] === true) {
            console.error('--tables and --dbs options cannot be combined');
            return false;
        }

        if (<boolean>options['dbs'] === true) {
            this.outputType = 'dbs';
        }
        else {
            // no processing of tables parameters now, it's the only (and therefor default) option
            if (<boolean>options['dbprefix'] === true) {
                this.dbPrefix = true;
            }
        }

        if (<boolean>options['json'] === true) {
            this.outputJson = true;
        }

        return true;
    }

    private outputDatabases() {

        let dbs = this.searcher.getDatabaseNames();
        dbs = dbs.sort((a, b) => a < b ? -1 : 1);

        if (this.outputJson) {
            console.log(JSON.stringify(dbs, undefined, 2));
        }
        else {
            dbs.forEach(db => {
                console.log(db);
            });
        }
    }

    private outputTables() {

        const tables = this.searcher.getTableNames();

        if (this.outputJson) {
            console.log(JSON.stringify(tables, undefined, 2));
        }
        else {

            if (!this.dbPrefix) {
                const tableArray = [...new Set(tables.map(item => item.table))];
                tableArray.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
                tableArray.forEach(tablename => {
                    console.log(tablename);
                });
            }
            else {
                const tableArray = [...new Set(tables.map(item => item.database + '.' + item.table))];
                tableArray.sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
                tableArray.forEach(tablename => {
                    console.log(tablename);
                });
            }
        }

    }
}
