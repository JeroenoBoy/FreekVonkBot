import { Message } from "discord.js";
import { Command, modules, sleep } from "../../..";


export = 
class TestCommand extends Command {

	setup() {
		this.name = 'Encode Channel';
		this.usage = '$psetencoded';
		this.catagory = 'MORSE';
		
		this.command = 'setmorse';
		this.permissions = 'MANAGE_MESSAGES';
		this.description = 'Zet het kanaal voor morse code messages.';
	}


	async run(cmd: string, args: string[], msg: Message) {

		modules.morse.setEncoded(msg.channel.id);

		const m = await msg.channel.send({content:'Dit kanaal is nu het kanaal voor gay messages.'});
		await sleep(3000);
		m.delete();
		msg.delete();
	}
}