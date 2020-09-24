import { Collection, StreamDispatcher, StreamOptions, VoiceChannel, VoiceConnection } from "discord.js"
import { Bot, cmdHandler, modules, UID } from "../..";

import path from 'path';
import ytdl from 'ytdl-core';
import ytsr from 'ytsr';
import SongItem from "./SongItem";


export =
class VoiceModule {

	protected connected: boolean = false;
	protected connection: VoiceConnection | null = null;

	protected songQueue: SongItem[] = [];
	
	protected dispatcher: StreamDispatcher | null = null;

	protected forcePlayBool: boolean = false;

	/**
	 * Load the module
	 */
	constructor() {
		cmdHandler.loadDir( path.join(__dirname, 'commands') );
	}



	/**
	 * Make the bot connect to an voice channel
	 * @param channel VoiceChannel
	 */
	async connect(channel: VoiceChannel): Promise<boolean> {
		if(this.connected == true)
			return false;

		if(!channel) return false;
		this.connection = await channel.join();
		this.connected = true;

		//
		//	Events
		//

		//	Disconnect event
		this.connection.on('disconnect', () => {
			if(this.connected)
				this.disconnect();
		});	

		return true;
	}



	/**
	 * Queue a song to the bot
	 * @param urlOrString url to an video or an string
	 * @param id id of the requested user
	 */
	async queue(urlOrString: string, id: string): Promise<{url: string, uid: UID}> {
		if(!this.connected || !this.connection)
			throw new Error('Bot is not connected');


		//	Test if its an string
		if(!urlOrString.match(/^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)) {

			const filters2 = await ytsr(null,
				{
					limit: 5,
					nextpageRef: 'https://www.youtube.com/results?search_query='+ encodeURI(urlOrString) +'&sp=EgIQAQ%253D%253D'
			});

			//	@ts-ignore
			urlOrString = filters2.items[0].link;
		}


		//	Validate the url
		const isInvalidvalid = await this.validateVideo(urlOrString);
		if(typeof isInvalidvalid == 'string')
			throw new Error('Invalid: ' + isInvalidvalid);

		
		//	Adding song
		const a = this.songQueue.push(
			new SongItem(urlOrString, id)
		);

		const uid = this.songQueue[a-1].uid
		
		if(!this.dispatcher)
			this.playNext();

		return { url: urlOrString, uid};
	}



	//
	//
	//	Player
	//
	//

	/**
	 * Play the next song
	 */
	playNext() {
		if(!this.connected || !this.connection)
			throw new Error('Bot is not connected');

		const song = this.songQueue[0];
		if(!song) return;

		this.play(song);
		
		this.songQueue.shift();
	}



	/**
	 * Force a song to be played
	 * @param song The forced song
	 */
	async forcePlay(song: SongItem) {
		if(!this.connected || !this.connection)
			throw new Error('Bot is not connected');

		this.forcePlayBool = true;

		await this.destroyDispatcher();
		this.play(song);
	}

	


	/**
	 * Play a new song
	 * @param song the song that needs to be played
	 */
	protected play(song: SongItem) {

		if(!this.connected || !this.connection)
			throw new Error('Bot is not connected');

		//	Speel het liedje af
		this.dispatcher = this.connection.play(
			ytdl(song.url, { filter: 'audioonly' }),
			{volume: 0.5}
		);

		//
		//	Events
		//

		this.dispatcher.on('close', async () => {
			if(this.forcePlayBool)
				return this.forcePlayBool = false;
			
			await this.destroyDispatcher()
			this.playNext();
		})
	}



	/**
	 * Destroy the dispatcher
	 */
	private async destroyDispatcher() {
		if(!this.dispatcher) return;
		
		this.dispatcher.destroy();
		this.dispatcher = null;
	}



	/**
	 * Stop the current song from getting played
	 */
	async stop() {
		if(!this.connected || !this.connection)
			throw new Error('Bot is not connected');

		if(!this.dispatcher)
			throw new Error('Dispatcher is not online');

		this.destroyDispatcher();
	}



	/**
	 * Disconnect the bot and clear queues
	 */
	async disconnect() {
		if(!this.connected || !this.connection)
			throw new Error('Bot is not connected');

		this.connected = false;
		this.songQueue = [];
		
		await this.connection?.disconnect();
		this.connection = null;
	}



	/**
	 * check if the URL is valid or not.
	 * @param url url
	 */
	async validateVideo(url: string): Promise< string | ytdl.videoInfo > {
		
		if(!ytdl.validateURL(url))
			return 'INVALID_URL'
		
		const link = await ytdl.getInfo(url);

		if(parseInt(link.videoDetails.lengthSeconds) >= 60*8)
			return 'VIDEO_TOO_LONG';

		return link;
	}



	//
	//
	//	Getters and setters
	//
	//

	/**
	 * Get the channel the bot is in
	 */
	getChannel(): VoiceChannel | undefined {
		return this.connection?.channel;
	}

	/**
	 * Check if the bot is connected to an voice channel
	 */
	isConnected(): boolean {
		return this.connected;
	}
}