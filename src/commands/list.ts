import { Config } from './../config';
import { Executable } from './../executable';
import { XrefFile, Searcher } from 'xrefparser';


export class ListCommand implements Executable {

    private config: Config;
    private outputJson = false;
    private dbPrefix = false;

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): void {

        const xreffiles = this.config.loadRepo(this.config.data.current);
        const searcher = new Searcher(xreffiles);

        const tables = searcher.getTableNames();

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

    validate(params: any) {

        const options = params['options'];

        // no processing of tables parameters now, it's the only (and therefor default) option
        if (<boolean>options['dbprefix'] === true) {
            this.dbPrefix = true;
        }

        if (<boolean>options['json'] === true) {
            this.outputJson = true;
        }

        return true;
    }

}
