import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType, VoiceConnection } from "@discordjs/voice";
import { VoiceChannel } from "discord.js"
import { MusicQueue, SongRequest, TrackOrigin } from "./MusicQueue";
import ytdl from 'ytdl-core';
import RequestUtils from "./RequestUtils";

export =
class MusicPlayer {

	public playing: SongRequest | undefined;
	public readonly queue = new MusicQueue();

	public readonly channel: VoiceChannel;
	public readonly connection: VoiceConnection;
	public readonly player: AudioPlayer;

	constructor(channel: VoiceChannel) {
		this.channel = channel;
		
		this.player = createAudioPlayer();
		this.connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guildId,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});

		this.player.on('stateChange', (_, newState) => {
			if(newState.status != AudioPlayerStatus.Idle) return;
			this.playing = undefined;
			
			const next = this.queue.next();
			if(next) return this.play(next);
			
		})

		this.connection.subscribe(this.player);
	}


	public async play(song: SongRequest) {

		//	Set song

		this.playing = song;

		//	Checking if the song is from youtube or not.

		if(song.origin = TrackOrigin.SPOTIFY) {
			const videos = await RequestUtils.getFromYoutube(song.title);
			song.id = videos[0].id
		}

		//	Creating stream

		const stream = ytdl('https://www.youtube.com/watch?v='+ encodeURIComponent(song.id));

		//	Playing song

		this.player.play(createAudioResource(stream));
	}


	public async skip() {
		if(!this.playing) throw new Error('No song getting played!');
		this.player.stop();
	}


	public request(song: SongRequest) {
		if(!this.playing)
			this.play(song);
		else
			this.queue.add(song);
	}


	public destroy() {
		this.player.removeAllListeners();
		this.player.stop();
		this.connection.destroy();
	}
}