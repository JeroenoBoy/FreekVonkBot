import { ClientUser, GuildMember, User } from "discord.js";
import { UID } from "../..";

export =
class SongItem {
	uid = new UID(5);

	url: string;
	user: string | undefined;
	userID: string | undefined;

	lengthSeconds: number;
	length: string;
	title: string;

	constructor(url: string, user: User | ClientUser, length: string, title: string) {
		this.url = url;

		this.user = user.tag;
		this.userID = user.id;

		this.lengthSeconds = parseInt(length);
		this.length = format(this.lengthSeconds);
		this.title = title
	}
}


function format(length: number): string {

	//	Hours
	var time = length/60/60;
	const hours = Math.floor(time);

	//	Minutes
	time = (time-hours) *60;
	const minutes = Math.floor(time);

	//	Seconds
	time = (time-minutes) *60;
	const seconds = Math.floor(time);


	//	Returns
	if(hours > 0)
		return `${hours}:${prettyNumber(minutes)}:${prettyNumber(seconds)}`;

	else
		return `${minutes}:${prettyNumber(seconds)}`


}


function prettyNumber(num: number, t = 2): string {
	var str = num.toString() || '';

	for (let i = 0; i < (t-str.length); i++)
		str = '0' + str;

	return str;
}