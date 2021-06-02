import { GuildMember, Message, TextChannel } from "discord.js";
import { Bot } from "../..";
import schedule from 'node-schedule';

type BirthdayFormat = [day: number, month: number, year: number];

export =
class Birthday {


	private birthdays = new Map<string, BirthdayFormat>();
	private _channel: string = '763771443627425833';
	private _notifyChannel: string = '753262395857829940';


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


			schedule.scheduleJob('* 12 * * *', () => {
				const date = new Date();
				const cDay = date.getDate()
				const cMonth = date.getMonth()+1;
				const cYear = date.getFullYear();

				const today: BirthdayFormat = [cDay, cMonth, cYear];
				
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
		for(const adder of dayAdders) {
			const date = this.subtractDate(birthday, adder);

			if(this.compareDates(today, date)) {
				const member = await this.notifyChannel.guild.members.fetch(user);
				return this.notifyChannel.send(`**${member!.nickname}** is over **${adder}** dag${adder == 1 ? '' : 'en'} jarig!`);
			}
		}
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
}