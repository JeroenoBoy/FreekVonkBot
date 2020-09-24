import { Message, MessageEmbed } from "discord.js";
import { Command, modules, sleep } from "../../..";
import Morse from "../MorseTranslator";


export =
class TestCommand extends Command {

	setup() {
		this.name = 'Encode Message';
		this.usage = '$pdecode <message>';
		this.catagory = 'MORSE';
		
		this.command = 'encode';
		this.description = 'Encode morse messages.';
	}


	async run(cmd: string, args: string[], msg: Message) {

		await msg.channel.send(new MessageEmbed()
			.setAuthor(msg.author.tag?.split('#')[0], msg.author.avatarURL() || '')
			.setColor('#1f456e')
			.setDescription( Morse.encode( args.join(' ') ) ));
	}
}