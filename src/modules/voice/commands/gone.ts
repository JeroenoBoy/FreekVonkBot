import { Message } from "discord.js";
import { Command, modules } from "../../..";



export =
class DespacitoCommand extends Command {

	setup() {
		this.name = 'Ga eens weg';
		this.command = 'ga';

		this.catagory = 'Voice';

		this.usage = '$pga';
		this.description = 'Laat freek weg gaan';
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {

		const member = await (msg.guild?.members
			.cache.get(msg.author.id));
		

		//	Check if the bot is in another channel
		if(!modules.voice.isConnected())
			return msg.reply('Ik zit niet in een voice kanaal.');


		//	Checking of de GuildMember gevonden kan woorden
		if(!member)
			return msg.reply('Ik kon je helaas niet vinden in de member lijst.');


		//	Checken of die in een voice kanaal zit.
		if(member.voice.channel?.id != modules.voice.getChannel()?.id)
			return msg.reply('Je bent niet in het voice kanaal van Freek.');

		
		modules.voice.disconnect();
		msg.react('✅');
	}
}