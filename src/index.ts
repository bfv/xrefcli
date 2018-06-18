#!/usr/bin/env node
import { ArgsParser } from './argsparser';
import { Config } from './config';
import { Executable } from './executable';

// commands
import { AboutCommand } from './commands/about';
import { InitCommand } from './commands/init';
import { ParseCommand } from './commands/parse';
import { RemoveCommand } from './commands/remove';
import { ReposCommand } from './commands/repos';
import { SearchCommand } from './commands/search';
import { ShowCommand } from './commands/show';
import { SwitchCommand } from './commands/switch';
import { ValidateCommand } from './commands/validate';

const config = new Config();
config.initialize();

const argsParser = new ArgsParser();
const args = argsParser.parse();

let commandExecutor: Executable | undefined;

switch (args.command) {
    case 'about':
        commandExecutor = new AboutCommand(config);
        break;
    case 'init':
        commandExecutor = new InitCommand(config);
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
}

if (commandExecutor !== undefined) {
    if (!commandExecutor.validate(args)) {
        process.exit(1);
    }
    commandExecutor.execute(args);
}

config.saveConfig();
process.exit(0);
