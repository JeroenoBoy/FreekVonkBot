import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../../..";

export =
class TacoCommand extends Command {

	setup() {
		this.name = 'Looking sus';
		this.usage = '$psus';
		this.catagory = 'FUN';
		
		this.command = 'suspect';
		this.aliases = ['sus', 'suspicous', 'imposter', 'sjoerd'];
		this.description = 'Imposter gevonden';
	}


	async run(cmd: string, args: string[], msg: Message): Promise<any> {
		await msg.channel.send({content:'<:lookingsus_1:758374786207842344><:lookingsus_2:758374786228551750>\n<:lookingsus_3:758374786207580190><:lookingsus_4:758374786187001938>'});
		msg.delete();
	}
}