import { Message, MessageEmbed } from "discord.js";
import { Command, modules } from "../../..";

export =
class NowPlaying extends Command {

	setup() {
		this.name = 'Schud';
		this.usage = '$pschud';
		this.catagory = 'VOICE';
		
		this.command = 'schud';
		this.description = 'Schud de wachtrij';
		this.aliases = ['shuffle']
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {
		const member = msg.member!;

		//	Check if the user is in a voice channel

		if(!member.voice.channel) return msg.reply({content: 'Waarom zit je niet bij mij in het kanaal?' });

		//	Checking if the bot is in a voice channel

		const player = modules.voice.resolve(msg.guild!);
		if(!player) return msg.reply({content: 'Ik ben niet in een kanaal.' });
		if(player.channel != member.voice.channel) return msg.reply({content: 'Waarom zit je niet bij mij in het kanaal?' });
		
		return msg.reply(`Ik heb shuffle ${player.queue.toggleShuffle() ? 'aan' : 'uit'} gezet`)
	}
}