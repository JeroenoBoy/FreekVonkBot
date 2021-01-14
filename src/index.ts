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

import MorseCode from './modules/morse/MorseCode';
import CmdModule from './modules/commandModule/cmdModule';
import VoiceModule from './modules/voice/VoiceModule';
import { setupSlashCommands } from './slashcommands/handler';


//
//	Setting up
//

const Bot = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'] });
const cmdHandler = new CommandHandler;

setupSlashCommands(Bot);

const modules = {
	cmdModule: new CmdModule,
	morse: new MorseCode,
	voice: new VoiceModule()
};

export {
	Bot,
	UID,
	Command,
	sleep,
	cmdHandler,
	modules,
}

//
//	Logging bot in
//

Bot.login(process.env.BOT_TOKEN);
Bot.on('ready', () => {
	console.log('Hey i logged in as: ' + chalk.green(Bot.user?.tag) + '.');
	console.log('started');
	
	Bot.user?.setActivity('Chillen met haaien.', { type: 'CUSTOM_STATUS' });
});