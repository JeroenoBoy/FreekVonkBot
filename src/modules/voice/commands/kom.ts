import { Collection, Message } from "discord.js";
import { Command, modules } from "../../..";



export =
class DespacitoCommand extends Command {

	setup() {
		this.name = 'Kom eens hier';
		this.command = 'kom';

		this.catagory = 'Voice';

		this.usage = '$pkom';
		this.description = 'Laat freek joinen';
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {

		const member = await (msg.guild?.members
			.cache.get(msg.author.id));
		

		//	Check if the bot is in another channel
		if(modules.voice.isConnected())
			return msg.reply('Ik zit al in een voice kanaal.');


		//	Checking of de GuildMember gevonden kan woorden
		if(!member)
			return msg.reply('Ik kon je helaas niet vinden in de member lijst.');


		//	Checken of die in een voice kanaal zit.
		if(!member.voice.channel)
			return msg.reply('Je bent niet in een voice kanaal.');

		
		modules.voice.connect(member.voice.channel);
		msg.react('✅');
	}
}