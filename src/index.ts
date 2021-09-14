console.log('');
//
//	Imports
//

import dotenv from 'dotenv';
import chalk from 'chalk';
dotenv.config();

import { Client, Intents } from 'discord.js';

import UID from './util/uid';
import sleep from './util/sleep';

import CommandHandler from './handlers/CommandHandler/CommandHandler';
import Command from './handlers/CommandHandler/Command';

import MorseCode from './modules/morse/MorseCode';
import CmdModule from './modules/commandModule/cmdModule';
import BirthdayModule from './modules/birthday/Birthday';
import VoiceModule from './modules/voiceModule/VoiceModule';

//
//	Setting up
//

const Bot = new Client<true>({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'], intents: [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Intents.FLAGS.GUILD_VOICE_STATES
] });
const cmdHandler = new CommandHandler();

const modules = {
	cmdModule: new CmdModule(),
	morse: new MorseCode(),
	birthday: new BirthdayModule(),
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
	Bot.user.setActivity('Chillen met haaien.', { type: 'CUSTOM' });
});