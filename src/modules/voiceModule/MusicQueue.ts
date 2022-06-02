import { Snowflake } from "discord-api-types/v10";

export class MusicQueue {

	private requests: SongRequest[] = [];
	private shuffle: boolean = false;

	public next() {
		if (this.shuffle) {
			const index = Math.floor(Math.random() * this.requests.length - .001);
			return this.requests.splice(index, 1)[0];
		}
		return this.requests.shift();
	}


	public add(request: SongRequest) {
		this.requests.push(request);
	}


	public map<T>(fn: (req: SongRequest, i: number) => T): T[] {
		return this.requests.map(fn);
	}


	public removeAt(index: number) {
		this.requests.splice(index - 1, 1);
	}


	public removeRange(start: number, end: number) {
		this.requests.splice(start - 1, end - start - 1);
	}


	public toggleShuffle() {
		return this.shuffle = !this.shuffle
	}


	public isEmpty(): boolean {
		return this.requests.length != 0;
	}


	public getRange(start: number, amount: number) {
		const list: SongRequest[] = [];
		for (let i = start; i < start + amount; i++) {
			if (!this.requests[i]) return list;
			list.push(this.requests[i]);
		}
		return list;
	}
}


export interface SongRequestNoUser {
	id: string,
	title: string,
	origin: TrackOrigin,
	artist?: string,
	url?: string
	duration: number
}

export interface SongRequest extends SongRequestNoUser {
	requester: Snowflake
}


export enum TrackOrigin {
	YOUTUBE, SPOTIFY, SOUNDCLOUD
}