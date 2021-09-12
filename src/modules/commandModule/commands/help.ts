import { Collection, Message, MessageEmbed, MessageReaction, PartialUser, User } from "discord.js";
import { Bot, cmdHandler, Command, UID } from "../../..";
import table from 'markdown-table';

const { prefix } = require('../../../../config.json');

export =
class HelpCommand extends Command {

	public catagories =  new Collection<string, UID[]>()
	public isLoaded = false;

	setup() {
		this.name = 'Help Command';
		this.usage = '$phelp [command]';
		this.catagory = 'UTILITY';

		this.command = 'help';
		this.aliases = ['h'];
		this.description = 'Freek helpt jou wel.';


		//	Events
		Bot.on('messageReactionAdd', (msg, user) => {
			if(msg.emoji.name != '❌') return;
			if(user.id == Bot.user?.id) return;

			//	Checking if there is an embed set
			if(msg.message.embeds.length <= 0)
				return;

			//	Check if this message is an help embed
			if(msg.message.embeds[0].footer?.text != 'Help Embed')
				return;

			//	Check if user created this embed
			if(msg.message.embeds[0].author?.name != user.tag)
				return;


			//	Delete embed
			msg.message.delete();
		})
	}


	async run(cmd: string, args: string[], msg: Message) {
		
		//	Show help command.
		if(args[0] == null) {
			
			//	Load all data
			if(!this.isLoaded) {
				this.loadData();
			}

			//	Creating embed
			const embed = new MessageEmbed()
				.setAuthor(msg.author.tag, msg.author.avatarURL() || '')
				.setFooter('Help Embed')
				.setColor('#016064');

			//	Loading into embed, format: name - command
			this.catagories.each((uids, key) =>
				embed.addField(key, this.drawTable(uids))
			);

			//	Sending message
			msg.channel.send({embeds:[embed]}).then(m => m.react('❌'));
			return;
		}

		
		//	Finding command data that belongs to this command
		const data = cmdHandler.commandData.find(cmd =>
			cmd.command.toLowerCase() == args[0].toLowerCase()
			|| cmd.name.toLowerCase() == args.join(' ').toLowerCase());

		if(!data) {
			msg.channel.send({content:'couldn\'t find this command exist'});
			return;
		}
		
		//	Creating embed
		const embed = new MessageEmbed()
			.setAuthor(msg.author.tag, msg.author.avatarURL() || '')
			.setFooter('Help Embed')
			.setColor('#016064')
			.addField('Command', data.command)
			.addField('Usage', data.usage.replace(/\$p/g, prefix))
			.addField('Name', data.name)
			.addField('Description', data.description)
			.addField('Catagory', data.catagory)

		if(data.aliases.length > 0)
			embed.addField('Aliases', data.aliases.join(', '));

		if(data.permissions != null)
			embed.addField('permissions', data.permissions.toString());

		//	Sending embed
		msg.channel.send({embeds:[embed]}).then(m => m.react('❌'));
	}


	protected async loadData() {

		cmdHandler.commandData.each(cmd => {
			//	Typeguard
			if(!cmd.id) return;
				
			//	If the catagory doesn't exist, create it
			if(!this.catagories.get(cmd.catagory)) {
				this.catagories.set(cmd.catagory, [ cmd.id ]);
			}

			//	Else just add it
			else
				this.catagories.get(cmd.catagory)?.push(cmd.id);
		});

		this.isLoaded = true;
	}


	protected drawTable(uids: UID[]): string {

		const data = [['Opdracht', 'Naam']];

		uids.forEach(id => {
			const cmd = cmdHandler.commandData.get(id);

			if(!cmd?.hidden)
				data.push([cmd?.command || 'INVALID', cmd?.name || 'INVALID'])
		})

		return "```" + table(data) + "```";
	}

}