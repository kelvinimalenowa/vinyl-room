require('dotenv').config();

async function getSpotifyToken() {
    const credentials = Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64');

    const response = await fetch(
        'https://accounts.spotify.com/api/token',
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials'
            })
        }
    );

    if (!response.ok) {
        throw new Error(`Spotify authentication failed: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
}

async function searchSpotifyTrack(title, artist) {
    const token = await getSpotifyToken();

    const query = `track:${title} artist:${artist}`;

    const params = new URLSearchParams({
        q: query,
        type: 'track',
        limit: '5'
    });

    const response = await fetch(
        `https://api.spotify.com/v1/search?${params}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Spotify search failed: ${response.status}`);
    }

    const data = await response.json();
    const tracks = data.tracks?.items || [];

    if (tracks.length === 0) {
        return null;
    }

    const track = tracks[0];

    return {
        spotifyId: track.id,
        title: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        album: track.album.name,
        albumArt: track.album.images[0]?.url || null,
        spotifyUrl: track.external_urls.spotify
    };
}

module.exports = {
    getSpotifyToken,
    searchSpotifyTrack
};