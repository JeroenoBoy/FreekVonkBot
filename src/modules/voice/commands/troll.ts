import { Collection, Message } from "discord.js";
import { Command, modules } from "../../..";
import path from 'path';
import ytdl from 'ytdl-core';
import SongItem from "../SongItem";



export =
class DespacitoCommand extends Command {

	path: string = path.join(__dirname, '../../../../sounds/rickroll.ogg');
	songs: Collection<string, SongItem> = new Collection<string, SongItem>();

	setup() {
		this.name = 'Get Memed';
		this.command = 'troll';

		this.hidden = true;

		this.catagory = 'Voice';

		this.usage = '$ptroll [song]';
		this.description = 'Alexa play despacito.';
		
		this.songs.set('roller', new SongItem('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'null'));
		this.songs.set('despacito', new SongItem('https://www.youtube.com/watch?v=gm3-m2CFVWM', 'null'));
		this.songs.set('uno', new SongItem('https://www.youtube.com/watch?v=W3GrSMYbkBE', 'null'));
		this.songs.set('minecito', new SongItem('https://www.youtube.com/watch?v=Gl6ekgobG2k', 'null'));
		this.songs.set('twitter', new SongItem('https://www.youtube.com/watch?v=1VaHIflPemM', 'null'));
		this.songs.set('star', new SongItem('https://www.youtube.com/watch?v=L_jWHffIx5E', 'null'));
		this.songs.set('bitch', new SongItem('https://www.youtube.com/watch?v=6Dh-RL__uN4', 'null'));
		this.songs.set('balpijn', new SongItem('https://www.youtube.com/watch?v=qPd1YWTSwE0&t=12s', 'null'));
	}

	
	async run(cmd: string, args: string[], msg: Message): Promise<any> {
		msg.delete();
		
		const member = await (msg.guild?.members
			.cache.get(msg.author.id));

		const song = this.songs.get(args.join(' '));
		if(!song) return msg.reply('this song doesn\'t exist')
		

		//	Checking of de GuildMember gevonden kan woorden
		if(!member)
			return msg.reply('Ik kon je helaas niet vinden in de member lijst.');


		//	Checken of die in een voice kanaal zit.
		if(!member.voice.channel)
			return msg.reply('Je bent niet in een voice kanaal.');;

			
		//	Als de boet niet geconnect is, connect hem
		if(!modules.voice.isConnected())
			await modules.voice.connect(member.voice.channel);

		//	Checken of die in het kanaal van freek zit
		else if(member.voice.channel.id != modules.voice.getChannel()?.id)
			return msg.reply('Je bent niet in het kanaal van Freek.');


		//	Forceplay een liedje
		await modules.voice.forcePlay(song);

		msg.channel.send('✅')
			.then(m => m.delete({timeout: 1000}));
	}
}