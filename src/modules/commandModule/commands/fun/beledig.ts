import { Message, MessageEmbed } from "discord.js";
import { Bot, Command } from "../../../..";
import fetch from 'node-fetch';

export =
class MemeCommand extends Command {

	setup() {
		this.name = 'Beledig mensen';
		this.usage = '$pbeledig [persoon]';
		this.catagory = 'FUN';
		
		this.command = 'beledig';
		this.description = 'Wees onaardig tegen iemand :(';
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {

		if(args.join(' ').includes(Bot.user?.id || 'etaetaheharhahre'))
			return msg.reply('Freek is heel lief :)');

		if(args.join(' ').toLowerCase().includes('freek'))
			return msg.reply('Freek is heel lief :)');

		const res = await fetch(
			('https://back.insult.tech/insult') +
			(args[0] != null ? ('?who=' + encodeURI(args.join(' '))) : ''));

		const data = await res.json();

		await msg.channel.send(data.insult);
	}
}