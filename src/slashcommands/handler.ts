import { Client } from "discord.js";
import { SlashCommandHandler } from 'slashdiscord.js';
import { memeCommand } from "./commands/meme";
import { tacoCommand } from "./commands/taco";


export function setupSlashCommands(bot: Client) {
	

	const handler = new SlashCommandHandler({
		client: bot
	});


	handler.addCommand({
		name: 'taco',
		description: 'TACOOOOO'
	}).run(tacoCommand)


	handler.addCommand({
		name: 'meme',
		description: 'memes zijn goed',
		options: [{
			type: 'STRING',
			name: 'subreddit',
			description: 'The subreddit to pick the meme from.',
			required: false
		}]
	}).run(memeCommand)
}