import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../../..";
import fetch from 'node-fetch';
import { StringLiteral } from "typescript";

export =
class TacoCommand extends Command {

	protected gifs: string[] = [];

	setup() {
		this.name = 'Milf';
		this.usage = '$pmilf';
		this.catagory = 'MILF';
		
		this.command = 'milf';
		this.description = 'nice';

		this.gifs = [
			'https://tenor.com/view/milf-american-pie-gif-4484782',
			'https://tenor.com/view/wcth-hearties-when-calls-the-gif-13537041',
			'https://tenor.com/view/90s-fashion-mom-jeans-jeans-high-waisted-gif-6026972',
			'https://tenor.com/view/sofia-vergara-bouncing-milf-gif-7274873',
			'https://tenor.com/view/blowjob-hotdog-gif-5738457',
			'https://tenor.com/view/milf-gif-4484779',
			'https://tenor.com/view/tigers-white-house-swag-dance-gif-16088732',
			'https://tenor.com/view/kin-world-kinnie-kin-milf-milf-monday-gif-18531427',
			'https://tenor.com/view/mom-boobs-sofia-vergara-hot-gif-18216217',
			'https://tenor.com/view/sofia-vergara-hi-modern-family-hola-holi-gif-12640013',
			'https://tenor.com/view/sof%C3%ADa-vergara-sof%C3%ADa-margarita-vergara-vergara-colombian-american-actress-go-leave-gif-17791692',
			'https://tenor.com/view/sofia-vergara-sexy-boobs-gif-11793562'
		]
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {
		msg.channel.send( this.gifs[ Math.floor( Math.random() * this.gifs.length ) ] )
			.then(m => m.react('👌'));
	}
}