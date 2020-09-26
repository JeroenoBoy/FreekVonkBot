import { Message, MessageEmbed } from "discord.js";
import { Command, modules, sleep } from "../../..";
import Morse from "../MorseTranslator";

export =
class TestCommand extends Command {

	setup() {
		this.name = 'Decode Message';
		this.usage = '$pdecode <morse>';
		this.catagory = 'MORSE';

		this.command = 'decode';
		this.description = 'Decode morse messages.';
	}


	async run(cmd: string, args: string[], msg: Message) {

		await msg.channel.send(new MessageEmbed()
		.setAuthor(msg.author.tag, msg.author.avatarURL() || '')
			.setColor('#1f456e')
			.setDescription( Morse.decode( args.join(' ') ) ));
	}
}