import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType, VoiceConnection } from "@discordjs/voice";
import { VoiceChannel } from "discord.js"
import { MusicQueue, SongRequest, TrackOrigin } from "./MusicQueue";
import { stream } from 'play-dl';
import RequestUtils from "./RequestUtils";

export default class MusicPlayer {

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

		if(song.origin == TrackOrigin.SPOTIFY) {
			const videos = await RequestUtils.querySoundCloud(song.artist + ' - ' + song.title);
			song.id = videos[0].id
		}

		//	Creating stream

		let songStream;
		let type: StreamType | undefined;
		
		switch(song.origin) {
			case TrackOrigin.SOUNDCLOUD:
				const soundCloudStream = await RequestUtils.getSoundCloudStream(song);
				songStream = soundCloudStream.stream;
				type = undefined;
				break;
			default:
				const youtubeStream = await stream('https://www.youtube.com/watch?v='+ encodeURIComponent(song.id));
				songStream = youtubeStream.stream;
				type = youtubeStream.type;
				break;
		}
		
		//	Playing song

		this.player.play(createAudioResource(songStream, { inputType: type }));
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


export function parseDuration(duration: number): string {

	let hour = -1, minutes = 0, seconds = 0;
	if(duration > 3600) {
		let [_hour, rest] = calc(duration, 3600);
		duration = rest;
		hour = _hour;
	}

	if(duration > 60) {
		let [_min, rest] = calc(duration, 60);
		duration = rest;
		minutes = _min;
	}

	seconds = duration;

	if(hour != -1) return `${hour}:${minL(minutes,2)}:${minL(seconds,2)}`;
	return `${minutes}:${minL(seconds,2)}`;
}

function calc(inp: number, div: number): [ res: number, target: number ] {
	const devided = inp/div;
	const shaved = Math.floor(devided);
	
	return [
		shaved,
		(devided - shaved) * div
	]
}

function minL(inp: number, length: number) {
	let s = (''+inp).split('.')[0];
	while(s.length < length)
		s+='0';
	return s;
}