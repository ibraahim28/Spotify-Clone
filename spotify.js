let currentSong = new Audio();
let prevbtn = document.getElementById("prev");
let playbtn = document.getElementById("play");
let nextbtn = document.getElementById("next");
let mutebtn = document.getElementById("mute");
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];

    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/songs/`)[1]);
    }
  }
  return songs;
}

async function main() {
  let songs = await getSongs();
  playMusic(songs[0], true)
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML + `<li> <img class="invert" src="/SVG/Music.svg" alt="Music">
                <div class="info">
                  <div>${song.replaceAll("%20", " ")}</div>
                  <div>Ibra</div>
                </div>
                <img class="invert" src="/SVG/play.svg" alt="Play"> </li>`;
  }

  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
  })

  //Attach an event listener to play/pause btn 

  playbtn.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      playbtn.src = "/SVG/pause.svg"
    } else {
      currentSong.pause();
      playbtn.src = "/SVG/play.svg"
    }
  })

  //Attach an event listener to mute btn

  mutebtn.addEventListener("click", () => {
    if (currentSong.muted) {
      currentSong.muted = false
      mutebtn.src = "/SVG/Volume-on.svg"
    }else{
      currentSong.muted = true;
      mutebtn.src = "/SVG/volume-off.svg"
    }
  })

  return songs

}

const playMusic = (track, pause = false) => {
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    playbtn.src = "/SVG/pause.svg"
  }
}

main();
