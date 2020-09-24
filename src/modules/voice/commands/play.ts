import { Collection, Message } from "discord.js";
import { Bot, Command, modules } from "../../..";
import ytdl from 'ytdl-core';



export =
class DespacitoCommand extends Command {

	setup() {
		this.name = 'Freek Zingt';
		this.command = 'speel';

		this.catagory = 'Voice';

		this.usage = '$pp [song]';
		this.aliases = ['play', 'p'];
		this.description = 'Laat freek zingen';
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {

		const member = await (msg.guild?.members
			.cache.get(msg.author.id));


		//	Of Freek in een voice kanaal zit
		if(!modules.voice.isConnected())
			return msg.reply('Ik zit niet in een spraak kanaal.');


		//	Checking of de GuildMember gevonden kan woorden
		if(!member)
			return msg.reply('Ik kon je helaas niet vinden in de member lijst.');


		//	Checken of die in het kanaal van freek zit
		if(member.voice.channel?.id != modules.voice.getChannel()?.id)
			return msg.reply('Je bent niet in het kanaal van Freek.');

		

		const {url, uid} = await modules.voice.queue(args.join(' '), member.id);
		await msg.reply('[`'+ uid.id +'`] Toegevoegd aan lijst:' + url)
		msg.react('✅')
	}
}