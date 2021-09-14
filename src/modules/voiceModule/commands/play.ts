import { GuildMember, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, VoiceChannel } from "discord.js";
import fetch from "node-fetch";
import ytdl from "ytdl-core";
import { Command, modules } from "../../..";

import RequestUtils from "../RequestUtils";
import { SongRequestNoUser } from "../MusicQueue";

export =
class PlayCommand extends Command {

	setup() {
		this.name = 'Zing';
		this.usage = '$pzing <query | url>';
		this.catagory = 'VOICE';
		
		this.command = 'zing';
		this.description = 'speel een liedje';
		this.aliases = ['speel', 'play', 'p']
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {

		const query = args.join(' ');
		const member = msg.member!;

		//	Getting voice

		if(!member.voice.channel) return msg.reply({content:'You must be in a voice channel!'});

		//	Checking if the bot is in a voice channel

		modules.voice.resolve(msg.guild!) || modules.voice.joinChannel(member.voice.channel as VoiceChannel);

		//	Acknowledge

		const m = await msg.reply({content: 'Getting data...'});

		//	Getting videos

		switch (true) {

			// Youtube

			case /^https:\/\/(www.)?youtube.com\/watch/.test(query): {
				const data = await RequestUtils.getFromYoutube(query);
				const vid = data[0]!;
				await this.loadSong(vid, m, member);
			}
			break;

			case /^https:\/\/(www.)?youtube.com\/playlist/.test(query): {
				const tracks = await RequestUtils.getYoutubePlaylist(query);
				if(!tracks) return m.edit({content: 'Failed to grab messages'});
				await this.loadManySongs(tracks, m, member)
			}
			break;
			
			// Spotify

			case query.startsWith('https://open.spotify.com/track/'): {
				const vid = await RequestUtils.getTrack(query);
				await this.loadSong(vid, m, member);
			}
			break;
			
			case query.startsWith('https://open.spotify.com/playlist/'): {
				const tracks = await RequestUtils.getTracksFromPlaylist(query);
				await this.loadManySongs(tracks, m, member);
			}
			break;
			
			case query.startsWith('https://'):
				await m.edit({content: 'Deze URL is mij niet bekent.'});
			break;
			case query.startsWith('http://'):
				await m.edit({content: 'Deze URL is mij niet bekent.'});
			break;

			case query == '': {
				await m.edit({content: 'Lever aub een liedje'});
			}
			break;
			
			default: {
				const videos = await RequestUtils.getFromYoutube(query);
		
				const vid = videos.find(v=>v.title.toLowerCase() == query.toLowerCase())
		
				//	Checking if the vid matches
		
				if(vid) await this.loadSong(vid, m, member);
				else	await this.selectSong(videos, m, member);
			}
			break;
		}

	}


	async selectSong(songs: SongRequestNoUser[], msg: Message, member: GuildMember) {
		const select = new MessageSelectMenu()
			.setCustomId('select')
			.addOptions(songs.map(s=>({
				label: s.title,
				description: `Lengte: ${s.duration} seconden`,
				value: s.id
			})))
		
		await msg.edit({content: 'Please pick one', components: [ new MessageActionRow().addComponents(select) ]})
		
		//	Creating collection

		const collection = msg.createMessageComponentCollector({
			filter: (interaction) => interaction.message.id == msg.id && interaction.user.id == member.id,
			max: 1,
			time: 30000
		})

		//	Collect the song		

		collection.on('collect', (interaction) => {
			if(!interaction.isSelectMenu()) return;
			
			this.loadSong(songs.find(s=>s.id==interaction.values[0])!, msg, member);

			collection.stop();
		})
		collection.on('dispose', () => {
			msg.edit({ content: 'Collector timed out.' })
		})
	}


	async loadSong(song: SongRequestNoUser, msg: Message, member: GuildMember) {

		const player = modules.voice.resolve(msg.guild!)!;
		player.request({...song, requester: member.id});

		await msg.edit({content: '`' + song.title.replace('\\', '\\\\').replace('`', '\\`') + '` Is toegevoegd aan de wachtrij!', components: []});
	}


	async loadManySongs(songs: SongRequestNoUser[], msg: Message, member: GuildMember) {

		const player = modules.voice.resolve(msg.guild!)!;

		for(const song of songs) {
			player.request({...song, requester: member.id});
		}

		await msg.edit({content: `Ik heb ${songs.length} liedjes toegevoegd aan de wachtrij`, components: []});
	}
}