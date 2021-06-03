import { GuildMember, Message, TextChannel, User } from "discord.js";
import { Bot } from "../..";
import schedule from 'node-schedule';

type BirthdayFormat = [day: number, month: number, year: number];

export =
class Birthday {


	private birthdays = new Map<string, BirthdayFormat>();
	private _channel: string = '763771443627425833';
	private _notifyChannel: string = '753262395857829940';


	private birthdayGifs = [
		'https://giphy.com/gifs/Just-Dance-birthday-happybirthday-bday-feio2yIUMtdqWjRiaF',
		'https://tenor.com/view/monkey-ape-dance-dancing-orangutan-gif-13620205',
		'https://tenor.com/view/wine-drinking-girl-happy-birthday-gif-14950409'
	];


	private get channel() {
		return Bot.channels.resolve(this._channel) as TextChannel;
	}


	private get notifyChannel() {
		return Bot.channels.resolve(this._notifyChannel) as TextChannel;
	}

	constructor() {
		Bot.once('ready', async () => {

			let fetched = await Bot.channels.fetch(this._channel) as TextChannel;

			
			fetched.messages.fetch({ limit: 100 }).then(msg => {
				msg.each((msg) => {
					this.addBirthday(msg);
				})
			});


			schedule.scheduleJob('0 12 * * *', () => {
				const today = this.today();
				
				this.birthdays.forEach((birthday, user) => {
					this.checkBirthday(birthday, today, [1, 2, 3, 5, 10], user);
				});
			});
		});


		Bot.on('message', (msg) => {
			if(msg.author.bot) return;
			if(msg.channel.id == this._channel) this.addBirthday(msg);
		})
	}


	addBirthday(msg: Message) {
		if(!msg.content.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
			// msg.delete();
			return msg.reply('Date must be formatted as \'dd/mm/yyyy\'\nPlease delete your message and send a new one with the correct formatting.').then(m=>m.delete({timeout: 5000}));
		}

		let [ _day, _month, _year ] = msg.content.split('/');
		let day = parseInt(_day);
		let month = parseInt(_month);
		let year = parseInt(_year);

		this.birthdays.set(msg.author.id, [day, month, year]);
	}


	async checkBirthday(birthday: BirthdayFormat, today: BirthdayFormat, dayAdders: number[], user: string) {

		if(this.compareDates(today, birthday)) {
			const gif = this.birthdayGifs[ Math.floor( Math.random() * this.birthdayGifs.length ) ]
			await this.notifyChannel.send(`Happy birthday <@${user}>!\n${gif}`);
		}


		for(const adder of dayAdders) {
			const date = this.subtractDate(birthday, adder);

			if(this.compareDates(today, date)) {
				const member = await this.notifyChannel.guild.members.fetch(user);
				return this.notifyChannel.send(`**${member!.nickname}** is over **${adder}** dag${adder == 1 ? '' : 'en'} jarig!`);
			}
		}
	}


	isBirthday(user: string) {
		const today = this.today();
		const bd = this.birthdays.get(user);

		if(!bd) return false;
		return this.compareDates(today, bd);
	}


	compareDates(a: BirthdayFormat, b: BirthdayFormat) {
		return a[0] == b[0] && a[1] == b[1];
	}


	subtractDate(date: BirthdayFormat, number: number): BirthdayFormat {
		let [ day, month, year ] = date;
		
		day -= number
		if(day <= 0) {
			month--;

			if(month <= 0) {
				month += 12;
				year--;
			}

			day += this.daysInMonth(month, year);
		}

		return [ day, month, year ];
	}


	daysInMonth(month: number, year: number) {
		return new Date(year, month, 0).getDate();
	}	


	today(): BirthdayFormat {
		const date = new Date();
		const cDay = date.getDate()
		const cMonth = date.getMonth()+1;
		const cYear = date.getFullYear();

		return [cDay, cMonth, cYear];
	}
}