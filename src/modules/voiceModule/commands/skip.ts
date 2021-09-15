import { Message } from "discord.js";
import { Command, modules } from "../../..";

export =
class PlayCommand extends Command {

	setup() {
		this.name = 'Skip';
		this.usage = '$pskip [<number>[-<number>]]';
		this.catagory = 'VOICE';
		
		this.command = 'skip';
		this.description = 'Sla een liedje over';
		// this.aliases = ['speel', 'play', 'p']
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {

		const query = args.join('').replace(/\s/g, '');
		const member = msg.member!;

		//	Check if the user is in a voice channel

		if(!member.voice.channel) return msg.reply({content: 'Waarom zit je niet bij mij in het kanaal?' });

		//	Checking if the bot is in a voice channel

		const player = modules.voice.resolve(msg.guild!);
		if(!player) return msg.reply({content: 'Ik ben niet in een kanaal.' });
		if(player.channel != member.voice.channel) return msg.reply({content: 'Waarom zit je niet bij mij in het kanaal?' });

		switch(true) {
			case /^\d+-\d+$/.test(query): {
				const matches = query.match(/^(\d+)-(\d+)$/)!;
				let start = parseInt(matches[1]);
				let end = parseInt(matches[2]);

				if(start >= end) msg.reply('Zo werkt het niet, vriend.')
				if(start == 0 ) {player.skip(); start++}

				player.queue.removeRange(start, end);
				
				await msg.reply(`Nummers van ${start} tot ${end} overgeslagen`);
			}
			break;

			case /^\d+$/.test(query): {
				const index = parseInt(query.match(/^(\d+)$/)![1]!)
				if(index == 0) player.skip();
				player.queue.removeAt(index);
				
				await msg.reply(`Nummer ${index} overgeslagen`)
			}
			break;

			case query == '': {
				player.skip()
				await msg.reply('Huidige nummer overgeslagen')
			}
			break;

			default: 
				return msg.reply('Invalid query');
		}
	}
}