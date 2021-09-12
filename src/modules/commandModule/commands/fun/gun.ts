import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../../..";

export =
class TacoCommand extends Command {

	setup() {
		this.name = 'PewPew';
		this.usage = '$pgun';
		this.catagory = 'FUN';
		
		this.command = 'gun';
		this.aliases = ['pew pew'];
		this.description = 'Pew';
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {
		await msg.channel.send({content:'https://cdn.discordapp.com/attachments/739918066993070112/850325534265442304/FreekGunBig.png'});
	}
}