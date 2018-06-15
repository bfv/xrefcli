import { Config } from './../config';
import { Executable } from './../executable';
import { XrefFile } from 'xrefparser';


export class ShowCommand implements Executable {

    config: Config;
    source = '';

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): void {

        const xreffiles = this.config.loadRepo(this.config.data.current);
        const xreffile = xreffiles.filter(item => item.sourcefile === this.source)[0];

        if (xreffile !== undefined) {
            console.log(JSON.stringify(xreffile, undefined, 2));
        }
        else {
            console.error(`source '${this.source}' not in repo '${this.config.data.current}'`);
        }
    }

    validate(params: any) {

        const options = params['options'];
        const source = <string> options['source'];

        if (source === undefined) {
            console.error('Error: a source name should be provided');
            return false;
        }

        this.source = source;

        return true;
    }

}
