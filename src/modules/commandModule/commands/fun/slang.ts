import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../../..";
import fetch from 'node-fetch';

export =
class TacoCommand extends Command {

	setup() {
		this.name = 'Slang';
		this.usage = '$pslang';
		this.catagory = 'FUN';
		
		this.command = 'slang';
		this.description = 'kut wurm';
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {
		msg.channel.send('https://media1.giphy.com/media/5t5SBA3d0Z87y22fW7/giphy.gif?cid=ecf05e47pz698mvpcwqtwjl3mm2blr0vjut6olxbhpmlmwqu&rid=giphy.gif')
			.then(m => m.react('🐍'));
	}
}