import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../..";
import fetch from 'node-fetch';

export =
	class MemeCommand extends Command {

		//	TODO: add region

		setup() {
			this.name = 'weer';
			this.usage = '$pweer [region = Utrecht | datum: morgen | overmorgen | over x [dag[en]]]';
			this.catagory = 'UTILITY';

			this.command = 'weer';
			this.description = 'Het is alweer tijd voor het weer';
		}

		//	Its a mess and I don't care

		async run(cmd: string, args: string[], msg: Message): Promise<any> {
			const res = await fetch('https://data.buienradar.nl/2.0/feed/json');
			const data = await res.json();

			let regionData: any;

			if (args.length > 0) {
				let forecast = undefined as any;

				if (args[0] == 'morgen') {
					forecast = data.forecast.fivedayforecast[0];
				}

				else if (args[0] == 'overmorgen') {
					forecast = data.forecast.fivedayforecast[1];
				}

				else if (args[0] == 'over') {
					const day = parseInt(args[1]);
					if (day < 1 || day > 5) return msg.channel.send('Dit is nog niet beschikbaar, het gaat tot 5 dagen.');
					forecast = data.forecast.fivedayforecast[day - 1];
				}

				if (forecast) {
					return await msg.channel.send({
						embeds: [new MessageEmbed()
							.setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL() })
							.setTitle(`Voorspellingen voor ${forecast.day.split('T')[0]}`)
							.setDescription(forecast.weatherdescription)
							.addField('Temperatuur', `${forecast.mintemperatureMin}°C - ${forecast.maxtemperatureMax}°C`, true)
							.addField('Windkracht', `${forecast.wind}`, true)
							.addField('Windrichting', `${forecast.windDirection}`, true)
							.addField('Zon kans', `${forecast.sunChance}`, true)
							.addField('Regen kans', `${forecast.rainChance}`, true)
							.addField('Regen', `${forecast.mmRainMin}mm - ${forecast.mmRainMax}`, true)
							.setThumbnail(forecast.iconurl)
						]
					})
				}


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
					.addField('Regen', regionData.rainFallLAstHour + 'ml', true)
					.addField('Windrichting', regionData.winddirection, true)
					.addField('Wind', regionData.windspeed + ' km/h', true)
					.setFooter({ text: 'Bericht door: ' + data.forecast.weatherreport.author })
				]
			});
		}
	}