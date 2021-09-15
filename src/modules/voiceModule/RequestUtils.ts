import fetch from "node-fetch";
import { getPlaylistVideos } from "usetube";
import SpotifyWebApi from 'spotify-web-api-node'
import { SongRequest, SongRequestNoUser, TrackOrigin } from "./MusicQueue";
import { search } from "play-dl";
import url from 'url';
import { Video } from "play-dl/dist/YouTube/classes/Video";
import Soundcloud from "soundcloud.ts";
import { PassThrough } from 'stream';

namespace RequestUtils {

	//#region Spotify
	
	//#region Spotify Authentication handler
	
	const spotifyApi = new SpotifyWebApi({
		clientId: 'b0ed0e38f04f4af1b1455d3edd9ead5c',
		clientSecret: 'f3e91ba52acd4ccf89d5867b8801a18e'
	});
	
	let _promise: Promise<void> | undefined;
	let _expires: number = 0;

	function authorizeSpotify() {
		if(_promise) return _promise;
		if(Date.now() < _expires) return;

		console.log('Getting new spotify token');

		return _promise = spotifyApi.clientCredentialsGrant()
			.then((d) => {
				spotifyApi.setAccessToken(d.body['access_token'])
				_expires = Date.now() + d.body['expires_in']*1000;
			})
			.catch((e) => console.log('Error while authorizing spotify', e));
	}

	//#endregion

	export async function getTrack(url: string): Promise<SongRequestNoUser> {
		await authorizeSpotify();

		const id = url.match(/^https:\/\/open.spotify.com\/track\/(.*)\?/i)![1]!;
		const { body: d } = await spotifyApi.getTrack(id);
		
		return {
			id: d.id,
			title: d.name,
			duration: d.duration_ms/1000,
			artist: d.artists[0].name,
			origin: TrackOrigin.SPOTIFY,
		}
	}

	//	Load a playlist

	export async function getTracksFromPlaylist(url: string): Promise<SongRequestNoUser[]> {
		await authorizeSpotify();

		const id = url.match(/^https:\/\/open.spotify.com\/playlist\/(.*)\?/i)![1]!;
		const { body: d } = await spotifyApi.getPlaylistTracks(id);

		return d.items.map(({track}): SongRequestNoUser => ({
			id: track.id,
			title: track.name,
			duration: track.duration_ms/1000,
			artist: track.artists[0].name,
			origin: TrackOrigin.SPOTIFY
		}))
	}

	//#endregion

	//#region Youtube

	export async function getFromYoutube(url: string): Promise<SongRequestNoUser[]> {
		const videos = await search(url) as Video[];
		
		return videos.map((v):SongRequestNoUser => ({
			id: v.id!,
			title: v.title!.slice(0,50),
			duration: v.durationInSec,
			origin: 0
		}));
	}

	export async function getYoutubePlaylist(_url: string) {
		const urlparser = new url.URL(_url);
		const id = urlparser.searchParams.get('list');

		if(!id) return null;

		return await getPlaylistVideos(id)
			.then(v=>v.map((v): SongRequestNoUser => ({
				id: v.id,
				title: v.original_title.slice(0,50),
				duration: v.duration,
				origin: 0
			})));
	}

	//#endregion

	//#region Soundcloud

	const soundcloud = new Soundcloud('DF1J1VJGeIPGyLofgH0KMq6LFWxNU2H9')

	export async function querySoundCloud(query: string): Promise<SongRequestNoUser[]> {
		const tracks = await soundcloud.tracks.searchV2({q: query});

		return tracks.collection.map((t) => ({
			id: `${t.user.permalink}/${t.permalink}`,
			title: t.title,
			duration: t.duration/1000,
			artist: t.user.username,
			origin: TrackOrigin.SOUNDCLOUD
		}));
	}

	export async function getSoundCloudSong(query: string): Promise<SongRequestNoUser | null> {
		const t = await soundcloud.tracks.getV2(query);

		return {
			id: `${t.user.permalink}/${t.permalink}`,
			title: t.title,
			duration: t.duration/1000,
			artist: t.user.username,
			origin: TrackOrigin.SOUNDCLOUD
		};
	}

	export async function getSoundCloudPlaylist(url: string): Promise<SongRequestNoUser[]> {
		const playlist = await soundcloud.playlists.getV2(url);

		return playlist.tracks.map((t) => ({
			id: `${t.user.permalink}/${t.permalink}`,
			title: t.title,
			duration: t.duration/1000,
			artist: t.user.username,
			origin: TrackOrigin.SOUNDCLOUD
		}));
	}

	export function getSoundCloudStream(song: SongRequest) {
		return new SoundCloudStream(`https://soundcloud.com/${song.id}`).Start();
	}

	class SoundCloudStream {

		public stream: PassThrough;
		public readonly url: string;

		constructor(url: string) {
			this.url = url;
			this.stream = new PassThrough();
		}

		private started = false;
		public async Start() {
			if(this.started) return this;
			this.started = true;

			const track = await soundcloud.util.streamTrack(this.url);
			track.pipe(this.stream);

			return this;
		}


	}

	//#endregion
}


export default RequestUtils;