import { Config } from './../config';
import { Executable } from './../executable';


export class AboutCommand implements Executable {

    config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    execute(params: any): void {

        console.log('\nxrefcli tool, OpenEdge XREF information from the command line');
        console.log('---------------------------------------------------------------');
        const pkginfo = require('pkginfo')(module, 'version', 'author');
        console.log('author: ', module.exports['author']);
        console.log('version:', module.exports['version']);
    }

    validate(params: any) {
        return true;
    }

}
