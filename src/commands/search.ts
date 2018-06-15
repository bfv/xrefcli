import { Config } from '../config';
import { Executable } from '../executable';
import { Searcher, XrefFile } from 'xrefparser';

export class SearchCommand implements Executable {

    private config: Config;
    private reponame = '';
    private searcher?: Searcher;

    // search params
    private field?: string;
    private table?: string;
    private hasCreates?: boolean;
    private hasUpdates?: boolean;
    private hasDeletes?: boolean;

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any) {

        const xreffiles = this.config.loadRepo(this.reponame);
        const searcher = new Searcher(xreffiles);

        let result: XrefFile[] = [];
        if (this.field !== undefined) {
            console.log('search field');
            result = searcher.getFieldReferences(this.field, this.table, this.hasUpdates);
        }
        else if (this.table !== undefined) {
            console.log('search table', this.table);
            result = searcher.getTabelReferences(this.table, this.hasCreates, this.hasUpdates, this.hasDeletes);
        }

        console.log(result.map(item => item.sourcefile));
        console.log('count=', result.length);
    }

    validate(params: any) {

        const options = params['options'];
        let reponame = options['name'];

        if (reponame === undefined) {
            if (this.config.data.current === undefined) {
                console.error('Error: no repo specified, no current repo');
                return false;
            }
            else {
                reponame = this.config.data.current;
            }
        }

        this.field = options['field'];
        this.table = options['table'];
        // console.log('field:', this.field);
        // console.log('table:', this.table);
        this.hasCreates = this.parseCrudValue(<string>options['create']);
        this.hasUpdates = this.parseCrudValue(<string>options['update']);
        this.hasDeletes = this.parseCrudValue(<string>options['delete']);

        this.reponame = reponame;

        return true;
    }

    private parseCrudValue(value: string): boolean | undefined {

        if (value !== undefined && value !== null) {
            value = value.toLowerCase();
            if (value === 'true' || value === 'yes') {
                return true;
            }
            else if (value === 'false' || value === 'no') {
                return false;
            }
        }

        return undefined;
    }
}
