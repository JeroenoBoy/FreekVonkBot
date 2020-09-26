import { Collection, Message } from "discord.js";
import { Bot, Command, modules } from "../../..";
import path from 'path';
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
		
		if(!Bot.user) return console.log('FUCK ME');

		this.songs.set('roller', new SongItem('https://www.youtube.com/watch?v=dQw4w9WgXcQ', Bot.user, '212', 'Get Rickrolled'));
		this.songs.set('despacito', new SongItem('https://www.youtube.com/watch?v=gm3-m2CFVWM', Bot.user, '240', 'Freek play despacito'));
		this.songs.set('uno', new SongItem('https://www.youtube.com/watch?v=W3GrSMYbkBE', Bot.user, '124', 'UUNNNOOOO'));
		this.songs.set('minecito', new SongItem('https://www.youtube.com/watch?v=Gl6ekgobG2k', Bot.user, '244', 'Minecraft cito'));
		this.songs.set('twitter', new SongItem('https://www.youtube.com/watch?v=1VaHIflPemM', Bot.user, '58', 'Twitter is goed'));
		this.songs.set('star', new SongItem('https://www.youtube.com/watch?v=L_jWHffIx5E', Bot.user, '236', 'Ur an all star'));
		this.songs.set('bitch', new SongItem('https://www.youtube.com/watch?v=6Dh-RL__uN4', Bot.user, '134', 'Fuck t-series'));
		this.songs.set('balpijn', new SongItem('https://www.youtube.com/watch?v=qPd1YWTSwE0', Bot.user, '227', 'Eenbaljongenman'));
		this.songs.set('robot pik', new SongItem('https://www.youtube.com/watch?v=rv9zEcispCU', Bot.user, '192', 'Robot penis'));
		this.songs.set('anime', new SongItem('https://www.youtube.com/watch?v=5eDv6aKOTK0', Bot.user, '93', 'Anime titties'))
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