import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../../..";

export =
class TacoCommand extends Command {

	setup() {
		this.name = '6ix9ine';
		this.usage = '$p69';
		this.catagory = 'FUN';
		
		this.command = '69';
		this.description = 'nice';
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {
		msg.channel.send({content:'Nice'})
			.then(m => m.react('👌'));
	}
}