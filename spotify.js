let currentSong = new Audio();
let prevbtn = document.getElementById("prev");
let playbtn = document.getElementById("play");
let nextbtn = document.getElementById("next");
let mutebtn = document.getElementById("mute");

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

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

  document.querySelector(".song-info").innerHTML = decodeURI(track);
  document.querySelector(".song-time").innerHTML = "00:00 : 00:00"
}

//add functionality to the circle
currentSong.addEventListener("timeupdate", ()=> {
  document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} : ${secondsToMinutesSeconds(currentSong.duration)}`;

  document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * (100) + "%";
})

//add an event listener to seekbar
document.querySelector(".seek-bar").addEventListener("click", e=>{
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  currentSong.currentTime = ((currentSong.duration)*percent) / 100;
})

//add an event listener to hamburger
document.querySelector(".hamburgerContainer").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0"
})

//add an event listener to close
document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-120%"
})
main();
