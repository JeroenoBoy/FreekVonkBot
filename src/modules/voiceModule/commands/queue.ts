import { GuildMember, Message, MessageEmbed } from "discord.js";
import { Command, modules } from "../../..";

import { searchVideo } from 'usetube';
import MusicPlayer, { parseDuration } from "../MusicPlayer";
import { MusicQueue, SongRequest } from "../MusicQueue";

export =
class NowPlaying extends Command {

	setup() {
		this.name = 'Wachtrij';
		this.usage = '$pwachtrij';
		this.catagory = 'VOICE';
		
		this.command = 'wachtrij';
		this.description = 'Zie de liedjes in de wachtrij';
		this.aliases = ['wr', 'np', 'nowplaying', 'queue', 'q']
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {
		const member = msg.member!;

		//	Checking if the bot is in a voice channel

		const player = modules.voice.resolve(msg.guild!);
		if(!player) return msg.reply({content: 'Ik ben niet in een kanaal' });
		if(!player.playing) return msg.reply({content: 'Ik speel geen liedjes af'})

		return msg.reply({embeds:[this.createEmbed(member, player, 0)]})
	}

	
	createEmbed(member: GuildMember, player: MusicPlayer, page: number) {

		const queue = player.queue.getRange(page*20,20);

		return new MessageEmbed()
			.setAuthor(member.displayName, member.user.displayAvatarURL())
			.setTitle('Wachtrij')
			.setDescription('```nim\n'
				+ 'NP) ' + this.formatSRQ(player.playing!) + '\n'
				+ queue.map((s, i) => (i+1) + ') ' + this.formatSRQ(s)).join('\n')
				+ '```')
	}


	formatSRQ(req: SongRequest) {
		return (req.artist ? (req.artist+' - ') : '') + req.title + '  (' + parseDuration(req.duration) + ')'
	}
}