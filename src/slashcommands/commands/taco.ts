import { TextChannel } from "discord.js";
import { Interaction } from "slashdiscord.js";
import { Bot } from "../..";



export async function tacoCommand(interaction: Interaction) {
	await interaction.pong();

	const channel = Bot.channels.cache.get(interaction.channel.id);

	if(!(channel instanceof TextChannel)) return console.log('no');


	if(Math.random() > 0.95)
		channel.send('<:TacoTurtle:758600127291064321>')
			.then(m => m.react('758600127291064321'));

	else
		channel.send('🌮')
			.then(m => m.react('🌮'));

}