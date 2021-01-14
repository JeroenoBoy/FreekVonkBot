import { MessageEmbed, TextChannel } from "discord.js";
import fetch from 'node-fetch';
import { Interaction } from "slashdiscord.js";
import { Bot } from "../..";


const subreddits: string[] = [
	'gamemeneersubmissies',
	'memes',
	'animeme',
	'programmerhumor',
	'lotrmemes',
	'dankhumor'
];


export async function memeCommand(interaction: Interaction): Promise<void> {
	await interaction.pong();
	const author = interaction.member;

	const channel = Bot.channels.cache.get(interaction.channel.id);
	if(!(channel instanceof TextChannel)) return console.log('no');

	//	select subreddit
	const d = interaction.data.options?.find(o=>o.name==='subreddit')?.value;
	const subreddit = d
	? encodeURI(d)
	: subreddits[ Math.floor( Math.random() * subreddits.length ) ];

	//	Getting posts
	const res = await(await fetch('https://api.reddit.com/r/' + subreddit + '/new')).json();

	//	Will be edited later
	const editable = await channel.send('Soon:tm:');

	//	Just another random post
	let post;
	try {
		const rand = Math.floor(Math.random() * res.data.dist);
		post = res.data.children[rand].data;
	}catch {
		editable.edit('<@' + author.id + '>, Deze subreddit ken ik niet');
		return;
	}

	//	changing message
	const embed = new MessageEmbed()
		.setURL('https://www.reddit.com' + post.permalink)
		.setColor('#f0dc82')
		
		.setAuthor('r/' + post.subreddit, author.user.avatarURL() || '')
		.setDescription(post.title)
		.setImage(post.url)
		.setFooter(new Date().toTimeString());

	await editable.edit('', embed);
	
}