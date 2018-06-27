import { Config } from '../config';
import { Executable } from '../executable';
import { Searcher, XrefFile } from 'xrefparser';
import { Help } from '../help';
import { Editor } from '../editor';

export class SearchCommand implements Executable {

    private config: Config;
    private reponame = '';
    private searcher?: Searcher;

    // search params
    private field?: string;
    private table?: string;
    private db?: string;
    private hasCreates?: boolean;
    private hasUpdates?: boolean;
    private hasDeletes?: boolean;
    private batch = false;
    private openSources = false;
    private jsonOutput = false;

    constructor(config: Config) {
        this.config = config;
    }

    async execute(params: any) {

        const xreffiles = this.config.loadRepo(this.reponame);
        const searcher = new Searcher(xreffiles);

        let result: XrefFile[] = [];
        if (this.field !== undefined) {
            result = searcher.getFieldReferences(this.field, this.table, this.hasUpdates);
        }
        else if (this.table !== undefined) {
            result = searcher.getTabelReferences(this.table, this.hasCreates, this.hasUpdates, this.hasDeletes);
        }
        else if (this.db !== undefined) {
            result = searcher.getDatabaseReferences(this.db);
        }

        if (this.openSources) {
            const editor = new Editor(this.config);
            await editor.open(result.map(item => item.sourcefile));
        }
        else {
            if (this.jsonOutput) {
                console.log(JSON.stringify(result.map(item => item.sourcefile), undefined, 2));
            }
            else {
                result.map(item => item.sourcefile).forEach(source => {
                    console.log(source);
                });
            }

            if (!this.batch) {
                console.log('count=', result.length);
            }
        }
    }

    validate(params: any) {

        const options = params['options'];

        if (<boolean>options['help'] === true) {
            const help = new Help();
            help.searchCommand();
            process.exit(0);
        }

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
        if (this.field === null) {
            console.error('Field name for --field option needs to be specified');
            return false;
        }

        this.table = options['table'];
        if (this.table === null) {
            console.error('Table name for --table option needs to be specified');
            return false;
        }

        this.db = options['db'];
        if (this.db === null) {
            console.error('Database name for --db option needs to be specified');
            return false;
        }

        this.hasCreates = this.parseCrudValue(<string>options['create']);
        this.hasUpdates = this.parseCrudValue(<string>options['update']);
        this.hasDeletes = this.parseCrudValue(<string>options['delete']);

        if ((<boolean>options['batch']) === true) {
            this.batch = true;
        }

        if ((<boolean>options['open']) === true) {
            this.openSources = true;
        }

        if ((<boolean>options['json']) === true) {
            this.jsonOutput = true;
        }

        this.reponame = reponame;

        return true;
    }

    private parseCrudValue(value: string): boolean | undefined {

        if (value !== undefined) {
            // the default value = true, so '--update' and '--update true' are the same
            if (value === null) {
                value = 'true';
            }

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
