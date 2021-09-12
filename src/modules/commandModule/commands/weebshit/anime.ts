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
		this.name = 'Anime';
		this.usage = '$panime <query>';
		this.catagory = 'WEEBSH1T';

		this.command = 'anime';
		this.description = 'find some weebshit'
	}

	async run(cmd: string, args: string[], msg: Message): Promise<any> {
		const variables: { [key: string]: any } = { page: 1 };
		const { member } = msg;

		const m = await msg.reply({content: 'Getting data'});

		//	Validating

		if(!msg.member) return m.edit({content:'Invalid member'});
		if(!args[0]) return m.edit({content:'Invalid query'});

		variables['search'] = args.join(' ');

		this.handlebars(m, variables, member!)
	}


	async handlebars(msg: Message, variables: {[key: string]: any}, ogMember: GuildMember) {
		const member = msg.member as GuildMember;

		//	Making request

		const data = await this.listAnime(variables);
		if(!data) return msg.edit({ content: 'Error while requesting api.' });

		//	Finding if its a full match
		
		const target = data.media.length == 1 ? data.media[0] : data.media.find(matchTitle(variables['search']));
		if(target) return this.makeAnimeDisplay(target, msg);

		//	Pagination

		const pages = Math.ceil(data.pageInfo.total / 5);
		const amount = data.media.length as number;
		const pageRow = new MessageActionRow()
			.addComponents([
				new MessageButton()
					.setStyle('SECONDARY')
					.setCustomId('⇐')
					.setLabel('⇐'),
				new MessageButton()
					.setStyle('SECONDARY')
					.setCustomId('⇒')
					.setLabel('⇒'),
			]);

		const iconsRow = new MessageActionRow()
			.addComponents(data.media.map((media: any, i: number) => new MessageButton()
				.setLabel((++i).toString())
				.setStyle('PRIMARY')
				.setCustomId(media.id.toString())
			))

		if(variables['page'] <= 1) pageRow.components[0].setDisabled(true);
		if(variables['page'] >= pages) pageRow.components[1].setDisabled(true);

		//	Final embed

		await msg.edit({
			content: '‫  ‫',
			components: [iconsRow, pageRow],
			embeds: [
				new MessageEmbed()
					.setAuthor(member.displayName, member.user.displayAvatarURL())
					.setTitle('Results for `' + variables['search'] + '`')
					.setDescription('```'+table([['#', 'title', 'format'], ...data.media.map((m:any, i: number)=>[i+1, m.title.english ?? m.title.romaji ?? m.title.native, m.format])])+'```')
					.setFooter(`Page ${variables['page']} / ${pages}`)
			]
		});

		//	Collection

		let collected = false

		const collection = msg.createMessageComponentCollector({
			filter: (i) => i.isButton() && i.message.id == msg.id && i.user.id == ogMember.id,
			time: 60000,
		});

		collection.once('collect', async (interaction) => {
			collected = true;
			collection.stop();

			const reply = (content: string) => interaction.reply({content}).then(()=>setTimeout(() => interaction.deleteReply(), 1000))

			if(interaction.customId == '⇒') 	 { ++variables['page']; this.handlebars(msg, variables, ogMember); reply(`Loading page ${variables['page']}`)}
			else if(interaction.customId == '⇐') { --variables['page']; this.handlebars(msg, variables, ogMember); reply(`Loading page ${variables['page']}`) }

			else {
				try {
					reply('Getting anime info')
					const target = await this.findOne(interaction.customId);
					this.makeAnimeDisplay(target, msg);
				}
				catch(error) {
					msg.reply('Error while making request');
					console.log(error);
				}
			}
		})

		collection.once('end', () => {
			if(collected) return;
			msg.edit({
				content: 'Collection closed.',
				embeds: [],
				components: []
			})
		})


	}


	makeAnimeDisplay(target: any, msg: Message) {
		const member = msg.member as GuildMember;

		msg.edit({content: '‫  ‫',embeds: [
			new MessageEmbed()
				.setAuthor(member.displayName, member.user.displayAvatarURL())
				.setTitle('Anime: ' + target.title.english)
				.setDescription(target.description
					.replace(/<i>([^<>]*)<\/i>/g,'*$1*')
					.replace(/<b>([^<>]*)<\/b>/g,'**$1**')
					.replace(/<br><br>/g,''))
				.addField('Format', target.format, true)
				.addField('Episodes', target.episodes.toString(), true)
				.addField('Other names', target.title.romaji + '\n' + target.title.native)
				.setImage(target.bannerImage)
				.setThumbnail(target.coverImage.large)
				.setURL(target.siteURL)
				.setFooter('Data van https://anilist.co')
		]})
	}


	listAnime(variables: {[key: string]: any}): Promise<any> {
		return fetch('https://graphql.anilist.co', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				query: `
					query($search: String, $page: Int) {
						Page(page: $page, perPage: 5) {
							pageInfo { total, currentPage }
							media(search: $search, type: ANIME) {
								title { english romaji native }
								coverImage { large }
								id
								type
								description
								episodes
								format
								bannerImage
								siteUrl
							}
						}
					}
				`,
				variables
			}),
		})
			.then(handleResponse)
			.then(d=>d.data.Page)
			.catch(handleError)
	}


	findOne(id: string): Promise<any> {
		return fetch('https://graphql.anilist.co', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				query: `
					query($id: Int) {
						Media(id: $id, type: ANIME) {
							title { english romaji native }
							coverImage { large }
							type
							description
							episodes
							format
							bannerImage
							siteUrl
						}
					}
				`,
				variables: { id }
			}),
		})
			.then(handleResponse)
			.then(d=>d.data.Media)
			.catch(handleError)
	}

}


function matchTitle(input: string) {
	input = input.toLowerCase();
	return (d: any) => {
		return (
			d.title.english?.toLowerCase() == input
		??	d.title.romaji?.toLowerCase() == input
		??	d.title.native?.toLowerCase() == input
		)
	}
}

function handleResponse(response: Response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleError(error: any) {
    console.log(error);
}