import { Message, MessageEmbed } from "discord.js";
import { Command, modules } from "../../../..";
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

		if(modules.birthday.isBirthday(msg.author.id)
		|| Math.random() > 0.95) {
			return msg.channel.send({content:'<:TacoTurtle:758600127291064321>'})
		}

		msg.channel.send({content:'🌮'})
	}
}