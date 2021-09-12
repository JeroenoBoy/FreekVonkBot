import { Message, MessageEmbed, MessageReaction, PartialUser, User } from "discord.js";
import { Bot, Command, sleep } from "../../../..";
import fetch from 'node-fetch';
import { StringLiteral } from "typescript";

export =
class TacoCommand extends Command {

	cooldown: number = 30000;
	lastUsage: number = 0;

	floodmsg: string = '';

	setup() {
		this.name = 'Mama komt';
		this.usage = '$pmama';
		this.catagory = 'MILF';
		
		this.command = 'mama';
		this.description = 'maak de chat safe';

		//	Create flood message
		const temp: string[] = [];
		for(let i = 0; i < 40; i++)
			temp.push('ᅠ')
		
		this.floodmsg = temp.join('\n');

		//	Events
		Bot.on('messageReactionAdd', (msg, user) => {
			if(msg.emoji.name != '❌')
				return;

			if(user.id == Bot.user?.id)
				return;

			//	Check if the message matches and is the correct user
			if(msg.message.content != user.id + '|' + this.floodmsg)
				return;

			const sender = msg.message.content.split('|')[0];

			if(sender != user.id)
				return;

			msg.message.delete();
			this.cooldown = 0;

		})
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {

		//	Check for cooldown
		if(this.lastUsage >= Date.now())
			return msg.reply('Deze opdracht kan maar eense per ' + this.cooldown/1000 + ' seconds.')

		//	Add cooldown
		this.lastUsage = Date.now() + this.cooldown;

		//	Send message.
		msg.channel.send(msg.author.id + '|' + this.floodmsg)
			.then(async m => {
				await m.react('❌');
				await sleep(this.cooldown);

				if(!m.deleted)
					await m.delete();
			});
		msg.react('✅')
	}
}