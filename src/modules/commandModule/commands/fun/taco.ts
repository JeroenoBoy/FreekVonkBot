import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../../..";
import fetch from 'node-fetch';

export =
class TacoCommand extends Command {

	setup() {
		this.name = 'Taco';
		this.usage = '$ptaco';
		this.catagory = 'FUN';
		
		this.command = 'taco';
		this.description = '🌮';
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {

		if(Math.random() > 0.95) {
			return msg.channel.send('<:TacoTurtle:758298585673891850>')
				.then(m => m.react('758298585673891850'));
		}

		msg.channel.send('🌮')
			.then(m => m.react('🌮'));

	}
}