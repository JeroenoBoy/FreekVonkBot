import fetch from "node-fetch";
import { getPlaylistVideos, searchVideo } from "usetube";
import SpotifyWebApi from 'spotify-web-api-node'
import { SongRequestNoUser, TrackOrigin } from "./MusicQueue";
import url from 'url';

namespace RequestUtils {

	const spotifyApi = new SpotifyWebApi({
		clientId: 'b0ed0e38f04f4af1b1455d3edd9ead5c',
		clientSecret: 'f3e91ba52acd4ccf89d5867b8801a18e'
	});

	//	Updating credentials

	async function grantCredentials() {
		console.log('Requesting a new spotify access token');
		const d = await spotifyApi.clientCredentialsGrant();

		if(d.body['access_token']) {
			spotifyApi.setAccessToken(d.body['access_token']);

			console.log('Request successfull!');

			setTimeout(() => grantCredentials(), d.body['expires_in']*1000)
		}
		else throw new Error('Could not get spotify access token');
	}

	//	Getting track from spotify

	export async function getTrack(url: string): Promise<SongRequestNoUser> {
		const id = url.match(/^https:\/\/open.spotify.com\/track\/(.*)\?/i)![1]!;

		const { body: d } = await spotifyApi.getTrack(id);
		
		return {
			id: d.id,
			title: d.name,
			duration: d.duration_ms/1000,
			origin: TrackOrigin.SPOTIFY,
		}
	}

	//	Load a playlist

	export async function getTracksFromPlaylist(url: string): Promise<SongRequestNoUser[]> {
		const id = url.match(/^https:\/\/open.spotify.com\/playlist\/(.*)\?/i)![1]!;

		const { body: d } = await spotifyApi.getPlaylistTracks(id);

		return d.items.map(({track}): SongRequestNoUser => ({
			id: track.id,
			title: track.name,
			duration: track.duration_ms/1000,
			origin: TrackOrigin.SPOTIFY
		}))
	}

	//	Search Youtube

	export async function getFromYoutube(query: string): Promise<SongRequestNoUser[]> {
		const data = await searchVideo(query);
		return data.videos.map((v):SongRequestNoUser => ({
			id: v.id,
			title: v.original_title.slice(0,50),
			duration: v.duration,
			origin: 0
		}));
	}

	export async function getYoutubePlaylist(query: string) {
		const urlparser = new url.URL(query);
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

	grantCredentials();
}


export default RequestUtils;