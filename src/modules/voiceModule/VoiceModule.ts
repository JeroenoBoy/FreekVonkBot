import { Guild, VoiceChannel } from "discord.js"
import { cmdHandler } from "../.."
import MusicPlayer from "./MusicPlayer"
import { join } from 'path';

export =
class VoiceModule {

	public readonly players = new Map<string, MusicPlayer>()
	constructor() {
		cmdHandler.loadDir(join(__dirname, './commands'))
	}

	public resolve(guildOrId: string | Guild): MusicPlayer | undefined {
		if(guildOrId instanceof Guild)
			return this.players.get(guildOrId.id);
		return this.players.get(guildOrId);
	}

	public joinChannel(channel: VoiceChannel) {
		if(this.players.has(channel.guild.id))
			throw new Error('I am already in a channel in this guild!');
		
		const player = new MusicPlayer(channel);
		this.players.set(channel.guild.id, player);
		return player;
	}
}