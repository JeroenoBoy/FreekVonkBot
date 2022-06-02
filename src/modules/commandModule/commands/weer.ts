import { Message, MessageEmbed } from "discord.js";
import { Bot, Command } from "../../..";
import fetch from 'node-fetch';

export =
	class MemeCommand extends Command {

		//	TODO: add region

		setup() {
			this.name = 'weer';
			this.usage = '$pweer [region = Utrecht]';
			this.catagory = 'UTILITY';

			this.command = 'weer';
			this.description = 'Het is alweer tijd voor het weer';
		}


		async run(cmd: string, args: string[], msg: Message): Promise<any> {
			const res = await fetch('https://data.buienradar.nl/2.0/feed/json');
			const data = await res.json();

			let regionData: any;

			if (args.length > 0) {
				const region = args.join(" ").toLocaleLowerCase();
				regionData = data.actual.stationmeasurements.find((r: { regio: string; }) => r.regio.toLowerCase() == region);

				if (!regionData) {
					return await msg.channel.send({
						embeds: [new MessageEmbed()
							.setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL() })
							.setTitle('Onbekende regio')
							.setDescription(`Regio's:\n` + data.actual.stationmeasurements.map((r: { regio: string; }) => r.regio).join('\n'))
						]
					});
				}
			}
			else {
				regionData = data.actual.stationmeasurements.find((r: { regio: string; }) => r.regio.toLowerCase() == 'utrecht');
			}

			await msg.channel.send({
				embeds: [new MessageEmbed()
					.setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL() })
					.setTitle('Het mooie weer in nederland')
					.setDescription(data.forecast.weatherreport.summary)
					.addField('Regio', regionData.regio, true)
					.addField('Temperatuur', regionData.temperature + '°C', true)
					.addField('Luchvochtigheid', regionData.humidity + '%', true)
					.addField('Windrichting', regionData.winddirection, true)
					.addField('Wind', regionData.windspeed + ' km/h', true)
					.setFooter({ text: 'Bericht door: ' + data.forecast.weatherreport.author })
					.setImage(data.actual.actualradarurl.split('?')[0] + "?w=256&h=256#" + Math.random())
				]
			});
		}
	}