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

		const m = await msg.reply({content: 'Getting data'});

		//	Fetching data

		const res = await fetch('http://173.249.2.6:5008/')
			.then((d) => d.json())
			.catch(() => m.edit({content:'Unable to retrieve data.'}))

		if(!res) return;
		
		m.edit({content: '.', embeds: [
			new MessageEmbed()
				.setAuthor(member.displayName, member.user.displayAvatarURL())
				.setTitle('Random anime titles')
				.setDescription('```'+res.data.join('\n')+'```')
				.setFooter('Generated with GPT-2')
		]})
	}

}