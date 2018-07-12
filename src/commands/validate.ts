import { Config } from './../config';
import { Executable } from './../executable';
import { XrefFile } from 'xrefparser';


export class ValidateCommand implements Executable {

    config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): Promise<void> {

        const promise = new Promise<void>(resolve => {

            let ok = true;
            const xreffiles = this.config.loadRepo(this.config.data.current);

            xreffiles.forEach(xreffile => {

                // check if all table have a name property
                xreffile.tables.forEach(table => {
                    if (table.name === undefined) {
                        console.error('undefied name attribute for table: ', JSON.stringify(table));
                        ok = false;
                    }
                });
            });

            if (ok) {
                console.log(this.config.data.current + ': OK');
            }

            resolve();
        });

        return promise;

    }

    validate(params: any) {
        return true;
    }

}
