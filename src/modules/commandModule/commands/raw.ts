import { Collection, Message, MessageEmbed, MessageReaction, PartialUser, User } from "discord.js";
import { Bot, cmdHandler, Command, UID } from "../../..";
import table from 'markdown-table';

const { prefix } = require('../../../../config.json');

export =
class ShowRaw extends Command {

	public catagories =  new Collection<string, UID[]>()
	public isLoaded = false;

	setup() {
		this.name = 'Rouw';
		this.usage = '$pRouw *reply to message*';
		this.catagory = 'UTILITY';

		this.command = 'rouw';
		this.aliases = ['raw'];
		this.description = 'Laat het rouwe bericht zien';
	}


	async run(cmd: string, args: string[], msg: Message) {

		const ref = await msg.fetchReference();

		msg.reply(
			'```'
			+ref.content
				.replace(/\\/g, '\\\\')
				.replace(/`/g, '\\`')
			+'```');
	}
}