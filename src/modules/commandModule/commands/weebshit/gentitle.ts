import { GuildMember, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import fetch, { Response } from "node-fetch";
import { Command } from "../../../..";
import table from 'markdown-table';


export =
class anime extends Command {

	cooldown: number = 30000;
	lastUsage: number = 0;

	floodmsg: string = '';

	setup() {
		this.name = 'Titel';
		this.usage = '$ptitel';
		this.catagory = 'WEEBSH1T';

		this.command = 'titel';
		this.description = 'Generate random novel titles'
	}

	async run(cmd: string, args: string[], msg: Message): Promise<any> {
		const { member } = msg;

		if(!member) return msg.reply({content: 'Invalid member'});

		const m = await msg.reply({content: 'Getting data, Dit kan een tijde duuren...'});

		//	Fetching data

		const res = await fetch('http://172.18.0.11:5009?prefix='+encodeURIComponent(args.join(' ')))
			.then((d) => d.json())
			.catch<void>(() => {m.edit({content:'Unable to retrieve data.'});})

		if(!res || !res.data) return;
		
		m.edit({content: '.', embeds: [
			new MessageEmbed()
				.setAuthor(member.displayName, member.user.displayAvatarURL())
				.setTitle('Random anime titles')
				.setDescription('```-'+res.data.join('\n-')+'```')
				.setFooter('Generated with GPT-2')
		]})
	}

}