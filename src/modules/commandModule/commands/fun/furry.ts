import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../../..";
import fetch from 'node-fetch';

export =
class TacoCommand extends Command {

	setup() {
		this.name = 'Detect furrys';
		this.usage = '$pfurry detector';
		this.catagory = 'FUN';
		
		this.command = 'furry';
		this.description = 'nice';
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {
		msg.channel.send({content:'Furry gedetecteerd: ' + ( Math.random() > 0.5 
		?  ' <@336981509045092352>'
		:  '<@857573008478306334>')});
	}
}