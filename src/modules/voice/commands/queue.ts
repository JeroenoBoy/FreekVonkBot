import { Message, MessageEmbed } from "discord.js";
import { Command, modules } from "../../..";
import table from 'markdown-table';



export =
class DespacitoCommand extends Command {

	setup() {
		this.name = 'Kom eens hier';
		this.command = 'liedjes';

		this.catagory = 'Voice';

		this.usage = '$psliedjes';
		this.aliases = ['queue'];
		this.description = 'Zeg eens alle liedjes in de lijst freek';
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {

		const member = await (msg.guild?.members
			.cache.get(msg.author.id));
		

		//	Check if the bot is in another channel
		if(!modules.voice.isConnected())
			return msg.reply('Ik ben niet aan het zingen.');
		
		
		const queue = modules.voice.getSongQueue()
		const NP = modules.voice.getPlaying();

		if(NP == null)
			return msg.reply('Er zitten geen liedjes in de queue.');


		//	Creating table
		const data = [['#', 'id', 'titel', 'requester', 'lengte']];


		data.push([
			'NP',
			NP.uid.id,
			stringParser(NP.title.split('- ')[1] || NP.title || 'UNDEFINED', 15),
			stringParser(NP.user?.split('#')[0] || 'UNDEFINED' , 15),
			'' + NP.length ])
	
		queue.forEach((e, i) => {
			data.push([
				'' + (i+1),
				e.uid.id,
				stringParser(e.title.split('- ')[1] || e.title || 'UNDEFINED', 15),
				stringParser(e.user?.split('#')[0] || 'UNDEFINED' , 15),
				'' + e.length ])
		})

		//	Creating embed
		msg.channel.send(new MessageEmbed()
			.setAuthor(msg.author.tag, msg.author.avatarURL() || '')
			.setColor('#FF7538')
			.addField('Liedjes', '```' + table(data) + '```'));
	}
}



function stringParser(str: string, length: number) {

	if(str.length > length)
		return str.substr(0, length-2) + '...';

	return str;
}