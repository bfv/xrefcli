import { Config } from './../config';
import { Executable } from './../executable';
import * as http from 'http';
import { Help } from '../help';

export class AboutCommand implements Executable {

    config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    async execute(params: any): Promise<void> {

        console.log('\nXREFCLI, OpenEdge XREF information from the command line');
        console.log('---------------------------------------------------------------');
        const pkginfo = require('pkginfo')(module, 'version', 'author');

        if (module.exports['author']['name'] === undefined) {
            console.log('author: ', module.exports['author']);
        }
        else {
            console.log('author: ', module.exports['author']['name'] + ' <' + module.exports['author']['email'] + '>');
        }

        const version: string = module.exports['version'];
        console.log('version:', version);

        // fetch information on latest
        const promise = new Promise<void>((resolve, reject) => {

            const req = http.get('http://registry.npmjs.com/xrefcli', res => {

                let body = '';

                res.on('data', (data) => {
                    body += data;
                });

                res.on('end', () => {

                    const npmRegistry = JSON.parse(body);
                    const latest = npmRegistry['dist-tags']['latest'];

                    console.log('latest: ', latest);
                    if (latest !== version) {
                        console.log('Newer version available, use "npm i xrefcli -g" to update');
                    }

                    resolve();
                });
            });

            // hide errors
            req.on('error', (err) => {
                resolve();
            });
        });

        return promise;
    }

    validate(params: any) {

        const options = params['options'];

        if (<boolean>options['help'] === true) {
            const help = new Help();
            help.aboutCommand();
            process.exit(0);
        }

        return true;
    }

}
