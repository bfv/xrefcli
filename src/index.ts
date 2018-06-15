#!/usr/bin/env node
import { ArgsParser } from './argsparser';
import { Config } from './config';
import { Executable } from './executable';
import { InitCommand } from './commands/init';
import { ListCommand } from './commands/list';
import { RemoveCommand } from './commands/remove';
import { SwitchCommand } from './commands/switch';

const config = new Config();
config.initialize();

const argsParser = new ArgsParser();
const args = argsParser.parse();

let commandExecutor: Executable | undefined;

switch (args.command) {
    case 'init':
        commandExecutor = new InitCommand(config);
        break;
    case 'list':
        commandExecutor = new ListCommand(config);
        break;
    case 'remove':
        commandExecutor = new RemoveCommand(config);
        break;
    case 'switch':
        commandExecutor = new SwitchCommand(config);
        break;
}

if (commandExecutor !== undefined) {
    commandExecutor.execute(args);
}

config.saveConfig();
process.exit(0);
