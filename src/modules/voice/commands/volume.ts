import { Message } from "discord.js";
import { Command, modules } from "../../..";



export =
class DespacitoCommand extends Command {

	setup() {
		this.name = 'Freek veranderd volume';
		this.command = 'volume';

		this.catagory = 'Voice';

		this.usage = '$pvolume [nummer]';
		this.aliases = ['vol'];
		this.description = 'Verander het volume van freek';
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {


		const member = await (msg.guild?.members
			.cache.get(msg.author.id));

	
		//	Checking of de GuildMember gevonden kan woorden
		if(!member)
			return msg.reply('Ik kon je helaas niet vinden in de member lijst.');

		
		//	Kijken of dit persoon in een spraak kanaal zit
		if(!member.voice.channel)
			return msg.reply('Je ziet niet in een spraak kanaal.')
			

		//	Of Freek in een voice kanaal zit
		if(!modules.voice.isConnected())
			await modules.voice.connect(member.voice.channel)


		//	Checken of die in het kanaal van freek zit
		if(member.voice.channel?.id != modules.voice.getChannel()?.id)
			return msg.reply('Je bent niet in het kanaal van Freek.');
			


		//	Check volume
		const vol = parseInt(args[0]);
		if(!vol)
			return msg.reply('Volume moet een nummer zijn.');

			
		modules.voice.setVolume(vol);
		msg.react('✅')
	}
}