import { Bot, cmdHandler } from "../..";

import fs from 'fs';
import path from 'path';
import { Channel, Message, MessageEmbed, TextChannel } from "discord.js";

import Morse from './MorseTranslator';

const { prefix } = require('../../../config.json');

export default
class MorseCode {
	
	protected morseChannel: string = '';
	protected decodeChannel: string = '';





	constructor() {

		cmdHandler.loadDir(path.join(__dirname, 'commands'));

		var json = JSON.parse(
			fs.readFileSync( path.join(__dirname, 'data.json'), { encoding:'utf8' } )
		);

		this.decodeChannel = json.decoded;
		this.morseChannel = json.encoded;



		//	Bot message event
		Bot.on('message', async (msg: Message) => {
			if(msg.author.bot) return;
			if(msg.content.startsWith(prefix)) return;



			//	Detect if there has been a message in any of the channels
			if(msg.channel.id == this.morseChannel) {
				const ch = await this.fetchChannel(this.decodeChannel);

				if(ch == null) return;

				//	Kek
				try{
					ch.send(new MessageEmbed()
						.setAuthor(msg.author.username, msg.author.avatarURL() || '')
						.setDescription(Morse.decode(msg.content))
						.setURL(msg.url)
						.setFooter((new Date()).toDateString()));
				}catch {
					const m = await msg.reply('De parser kon dit niet begrijpen!');
					m.delete({timeout: 2500});
					msg.delete({timeout: 2500});
				}
			}



			if(msg.channel.id == this.decodeChannel) {
				const ch = await this.fetchChannel(this.decodeChannel);

				if(ch == null) return;

				//	Kek
				try{
					ch.send(Morse.encode(msg.content));
				}catch {
					msg.reply('De parser kon dit niet begrijpen!')
						.then(m => m.delete({timeout: 2500}));
				}
			}

		});
	}






	public setDecoded(id: string) {

		this.decodeChannel = id;
		this.save();
	}





	public setEncoded(id: string) {

		this.morseChannel = id;
		this.save();

	}

	protected save() {

		fs.writeFileSync(
			path.join(__dirname, 'data.json'), 
			JSON.stringify({
				decoded: this.decodeChannel,
				encoded: this.morseChannel
			})
		);

	}


	protected async fetchChannel(id: string): Promise<TextChannel | void> {

		const ch = await Bot.channels.fetch(id);

		if (!ch) return;

		// Using a type guard to narrow down the correct type
		if (!((ch): ch is TextChannel => ch.type === 'text')(ch)) return;

		return ch;
	}
}