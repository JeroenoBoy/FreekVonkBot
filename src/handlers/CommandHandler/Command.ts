import { Message, PermissionResolvable } from "discord.js";
import UID from "../../util/uid";
const { defaultPermissionsMessage } = require('../../../config.json');


export default
class Command {
	public id: UID | null = null;
	
	public name: string = 'UNNAMED';
	public catagory: string = 'UNCATAGORIZED';
	public description: string = 'NO DESCRIPTION';
	public usage: string = 'NO USAGE';
	
	public command: string = 'NOCOMMAND';
	public aliases: string[] = [];

	public permissions: PermissionResolvable | null = null;
	public permissionMessage = defaultPermissionsMessage;

	public hidden: boolean = false;

	preSetup(id: UID) {
		this.id = id;
		this.setup();
	}

	setup() {
		return;
	}

	/**
	 * Run the function
	 * @param {String} cmd the command executed
	 * @param {Message} msg the message itself
	 * @param {String[]} args arguments of this command
	 */
	async run(cmd: string, args: string[], msg: Message) {
		msg.channel.send({content:'Deze command is <@301354663431634944> dom geweest'
		+ '\n naam: ' + this.name
		+ '\n cmd: '  + this.command});
	}
};