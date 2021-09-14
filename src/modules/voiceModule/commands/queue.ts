import { GuildMember, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, VoiceChannel } from "discord.js";
import fetch from "node-fetch";
import ytdl from "ytdl-core";
import { Command, modules } from "../../..";

import { searchVideo } from 'usetube';

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
		
		if(!player.playing) {
			if(player.queue.isEmpty()) return msg.reply({content: 'Ik speel geen liedjes af'})

			return msg.reply({embeds: [
				new MessageEmbed()
					.setAuthor(member.displayName, member.user.displayAvatarURL())
					.setTitle('Wachtrij')
					.setDescription('```'
						+ player.queue.map((s, i) => '#'+(i+1) + ' - ' + s.title).join('\n')
						+ '```')
			]})

		}

		return msg.reply({embeds: [
			new MessageEmbed()
				.setAuthor(member.displayName, member.user.displayAvatarURL())
				.setTitle('Wachtrij')
				.setDescription('```'
					+ 'NP - ' + player.playing!.title + '\n'
					+ player.queue.map((s, i) => '#'+(i+1) + ' - ' + s.title).join('\n')
					+ '```')
		]})
	}
}