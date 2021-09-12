import { Message } from "discord.js";
import { Command, modules, sleep } from "../../..";


export =
class TestCommand extends Command {

	setup() {
		this.name = 'Decode Channel';
		this.usage = '$psetdecode';
		this.catagory = 'MORSE';
		
		this.command = 'setdecode';
		this.permissions = 'MANAGE_MESSAGES';
		this.description = 'Zet het kanaal voor decoded morse code messages.';
	}


	async run(cmd: string, args: string[], msg: Message) {

		modules.morse.setDecoded(msg.channel.id);
		
		const m = await msg.channel.send({content:'Dit kanaal is nu het kanaal voor decoded gay messages.'});
		await sleep(3000);
		m.delete();
		msg.delete();
	}
}