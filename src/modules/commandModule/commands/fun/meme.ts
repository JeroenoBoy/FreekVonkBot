import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../../..";
import fetch from 'node-fetch';

export =
class MemeCommand extends Command {

	subreddits: string[] = [
		'gamemeneersubmissies',
		'memes',
		'animeme',
		'programmerhumor',
		'lotrmemes',
		'dankhumor'
	];

	setup() {
		this.name = 'Leuke Memerij';
		this.usage = '$pmeme [subreddit]';
		this.catagory = 'FUN';
		
		this.command = 'meme';
		this.description = 'Racistische plaatjes waarin grappen woorden gemaakt over niet-witte mensen.';
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {
		
		//	select subreddit
		const subreddit = encodeURI(args.join(''))
		|| this.subreddits[ Math.floor( Math.random() * this.subreddits.length ) ];

		//	Getting posts
		const res = await(await fetch('https://api.reddit.com/r/' + subreddit + '/new')).json();

		//	Will be edited later
		const editable = await msg.channel.send('Soon:tm:');

		//	Just another random post
		let post;
		try {
			const rand = Math.floor(Math.random() * res.data.dist);
			post = res.data.children[rand].data;
		}catch {
			return editable.edit('<@' + msg.author + '>, Deze subreddit ken ik niet')
		}

		//	changing message
		editable.edit('ᅠ');
		const embed = new MessageEmbed()
			.setURL('https://www.reddit.com' + post.permalink)
			.setColor('#f0dc82')
			
			.setAuthor(post.subreddit, msg.author.avatarURL() || '')
			.setDescription(post.title)
			.setImage(post.url)
			.setFooter(new Date().toTimeString());

		await editable.edit(embed);
	}
}