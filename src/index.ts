console.log('');
//
//	Imports
//

import dotenv from 'dotenv';
import chalk from 'chalk';
dotenv.config();

import { Client } from 'discord.js';

import UID from './util/uid';
import sleep from './util/sleep';

import CommandHandler from './handlers/CommandHandler/CommandHandler';
import Command from './handlers/CommandHandler/Command';


import path from 'path';
import MorseCode from './modules/morse/MorseCode';
import CmdModule from './modules/commandModule/cmdModule';

//
//	Setting up
//

const Bot = new Client();
var cmdHandler: CommandHandler;

const modules: any = {};

export {
	Bot,
	UID,
	Command,
	sleep,
	cmdHandler,
	modules,
}
(async () => {
	
	cmdHandler = await new CommandHandler();
	
	modules.morse = await new MorseCode();
	modules.cmdModule = await new CmdModule();

	//
	//	Logging bot in
	//
	
	Bot.login(process.env.BOT_TOKEN);
	Bot.on('ready', () => {
		console.log('Hey i logged in as: ' + chalk.green(Bot.user?.tag) + '.');
		
		Bot.user?.setActivity('Chillen met haaien.', { type: 'CUSTOM_STATUS' });
	});
})();