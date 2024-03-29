import { cmdHandler, Command } from "../..";

import path from 'path';
import { Message } from "discord.js";


export =
class CmdModule {
	startDirectory: string = 'commands';

	constructor() {
		cmdHandler.loadDir(path.join(__dirname, this.startDirectory));
		cmdHandler.on('invalidCommand', this.onInvalidCommand);
	}



	async onInvalidCommand( cmd: string | undefined, args: string[], msg: Message ) {

		if(!cmd) {
			msg.channel.send({content:'Hoi'});
		}

		else {
			msg.channel.send({content:'Deze opdracht komt niet bekend voor bij mij.'});
		}

	}
}