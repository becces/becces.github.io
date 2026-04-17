<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8">
<title>Min Musik</title>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #121212;
  color: white;
}

header {
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
}

.container {
  padding: 20px;
}

.song {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background: #1e1e1e;
  border-radius: 8px;
  cursor: pointer;
}

.song:hover {
  background: #2a2a2a;
}

.song img {
  width: 50px;
  height: 50px;
  margin-right: 15px;
}

.song-info {
  flex-grow: 1;
}

.song-title {
  font-size: 16px;
}

.song-artist {
  font-size: 12px;
  color: #aaa;
}

audio {
  display: none;
}

.player {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #181818;
  padding: 10px;
}
</style>
</head>

<body>

<header>🎵 Min Musik</header>

<div class="container">

<div class="song" onclick="playSong('song1.mp3', 'Låt 1')">
  <img src="cover1.jpg">
  <div class="song-info">
    <div class="song-title">Låt 1</div>
    <div class="song-artist">Du</div>
  </div>
</div>

<div class="song" onclick="playSong('song2.mp3', 'Låt 2')">
  <img src="cover2.jpg">
  <div class="song-info">
    <div class="song-title">Låt 2</div>
    <div class="song-artist">Du</div>
  </div>
</div>

</div>

<div class="player">
  <span id="nowPlaying">Ingen låt spelas</span>
</div>

<audio id="audioPlayer" controls></audio>

<script>
const player = document.getElementById("audioPlayer");
const nowPlaying = document.getElementById("nowPlaying");

function playSong(file, title) {
  player.src = file;
  player.play();
  nowPlaying.innerText = "Spelar: " + title;
}
</script>

</body>
</html>
