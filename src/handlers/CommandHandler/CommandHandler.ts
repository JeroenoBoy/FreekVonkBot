// const bot = require('../');

import { Collection, Message } from "discord.js";
import { Bot, UID, Command } from '../..';

import { EventEmitter } from 'events';

import fs from 'fs';
import path from 'path';

const { prefix } = require('../../../config.json');

export default
class CommandHandler extends EventEmitter {

	//	settings
	setup: boolean = false;

	//	Command data
	public aliases: Collection<string, UID>;
	public commands: Collection<string, UID>;
	public commandData: Collection<UID, Command>;

	config: { ignoreToken: string; };

	constructor(config: { ignoreToken: string; } | undefined = { ignoreToken: '@' }) {
		super();

		this.config = {
			ignoreToken: config?.ignoreToken
		};

		this.commands = new Collection<string, UID>();
		this.aliases = new Collection<string, UID>();
		this.commandData = new Collection<UID, Command>();

		this.start();
	}


	private async start() {
		if(this.setup) return;

		//	This listens for the commands
		Bot.on('messageCreate', async (msg) => {
			try {
				if(msg.channel.id == msg.author.dmChannel?.id) return;
				if(msg.author.id == Bot.user?.id) return;

				//	Checking if the command starts witht he bot prefix
				if(!msg.content.toLowerCase().startsWith(prefix.trim().toLowerCase())) return;

				
				//	Defining constants
				const args: string[] = msg.content.substring(prefix.length).split(' ');
				const cmd: string | undefined = args.shift()?.toLowerCase();

				//	Emit event
				if(!cmd) return this.emit('invalidCommand', cmd, args, msg) as any  as void;

				//	Getting command
				let command = this.commands.get(cmd);
				if(command == null) {
				
					//	If not set, check aliases
					command = this.aliases.get(cmd);

					//	Emit event of command non exist
					if(command == null)
						return this.emit('invalidCommand', cmd, args, msg) as any  as void;
				}

				//	Get Command
				const commandData: Command = this.commandData.get(command)!;

				//	Checking permissions
				if(commandData.permissions != null) {
					const member = await msg.guild?.members.fetch(msg.author.id);

					if(!member?.permissions.has(commandData.permissions)) {
						return msg.reply(commandData.permissionMessage) as any as void;
					}
				}

				//	Try and catch for errors
				try {
					await commandData.run(cmd, args, msg);
				}
				catch(e) {
					msg.reply('Oh nee, er is een probleempje!');
					console.error(e);
				}
			}
			catch(e) {
				msg.reply('Oh nee, er is een erg probleempje!');
				console.error(e);
			}
		});

		this.setup = true;
	}

	/**
	 * Add a command to the command handler
	 * @param cmd command class to add
	 */
	public async loadCommand(cmd: Command) {

		//	Generating the id for this command
		const id = new UID();

		//	Setup the command
		cmd.preSetup(id);

		//	adding command to the database
		this.commandData.set(id, cmd);

		//	adding a new command
		if(this.commands.get(cmd.command.toLowerCase()) != null) throw new TypeError('Error: command ' + cmd.command + ' is already defined.');
		this.commands.set(cmd.command.toLowerCase(), id);

		//	adding the aliases
		cmd.aliases.forEach(a => {
			this.aliases.set(a.toLowerCase(), id);
		});
	}

	/**
	 * Load an directory to the CommandHandler
	 * @param dir absoulte path of this directory
	 */
	public async loadDir(dir: string) {

		const files = await fs.readdirSync(dir);

		files.forEach(async file => {
			const fdir = path.join(dir, file)


			//	Collecting stats
			const stats = await fs.lstatSync( fdir );


			//	Checking if file/folder should be read
			if(file.startsWith(this.config.ignoreToken)) {
				return;
			}


			//	Checking if its an directory for nesting
			if(stats.isDirectory()) {
				return await this.loadDir(fdir);
			}
			

			try {
				//	Getting file
				const temp = new (require(fdir));
				
				//	Checking if its the right class
				if(!(temp instanceof Command)) return;
	
				//	Adding to command handler
				this.loadCommand(temp);
			}
			catch {}
		});

	}
}