#!/usr/bin/env node
import { ArgsParser } from './argsparser';
import { Config } from './config';
import { Executable } from './executable';

// commands
import { AboutCommand } from './commands/about';
import { InitCommand } from './commands/init';
import { ListCommand } from './commands/list';
import { ParseCommand } from './commands/parse';
import { RemoveCommand } from './commands/remove';
import { ReposCommand } from './commands/repos';
import { SearchCommand } from './commands/search';
import { ShowCommand } from './commands/show';
import { SwitchCommand } from './commands/switch';
import { ValidateCommand } from './commands/validate';
import { Help } from './help';
import { ExportCommand } from './commands/export';
import { CliArgs } from './types';

const argsParser = new ArgsParser();
const argv = argsParser.parse();

const config = new Config();
config.initialize(argv).then(() => {
    executeCommand(argv);
}, err => {
    process.exit(1);
});

function executeCommand(args: CliArgs) {

    let commandExecutor: Executable | undefined;

    switch (args.command) {
        case 'about':
            commandExecutor = new AboutCommand(config);
            break;
        case 'export':
            commandExecutor = new ExportCommand(config);
            break;
        case 'init':
            commandExecutor = new InitCommand(config);
            break;
        case 'list':
            commandExecutor = new ListCommand(config);
            break;
        case 'parse':
            commandExecutor = new ParseCommand(config);
            break;
        case 'remove':
            commandExecutor = new RemoveCommand(config);
            break;
        case 'repos':
            commandExecutor = new ReposCommand(config);
            break;
        case 'search':
            commandExecutor = new SearchCommand(config);
            break;
        case 'show':
            commandExecutor = new ShowCommand(config);
            break;
        case 'switch':
            commandExecutor = new SwitchCommand(config);
            break;
        case 'validate':
            commandExecutor = new ValidateCommand(config);
            break;
        default:
            break;
    }

    if (commandExecutor !== undefined) {
        if (!commandExecutor.validate(args)) {
            process.exit(1);
        }
        execute(commandExecutor, args).then(() => {
            config.saveConfig();
            process.exit(0);
        });
    }
    else {
        const help = new Help();
        help.main();
        process.exit(1);
    }
}

async function execute(commandExec: Executable, args: CliArgs) {
    await commandExec.execute(args);
}
