export function getBaseSpotifyAuthUrl() {
  const host = window.location.href;
  const url = `https://accounts.spotify.com/authorize?client_id=c3cffede07d5469081fa41af153063fe&response_type=code&redirect_uri=${host}play/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;
  return url;
}
