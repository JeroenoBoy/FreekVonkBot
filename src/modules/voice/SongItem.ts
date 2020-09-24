import { UID } from "../..";


export =
class SongItem {
	uid = new UID(5);

	url: string;
	user: string;

	constructor(url: string, user: string) {
		this.url = url;
		this.user = user;
	}
}