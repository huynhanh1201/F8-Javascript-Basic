const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = JSON.stringify("F8_PLAYER");

const playList = $(".playlist");
const heading = $("header h2");
const cd = $(".cd");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const play = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextSong = $(".btn-next");
const prevSong = $(".btn-prev");
const randomSong = $(".btn-random");
const repeatSong = $(".btn-repeat");
const song = $(".song");
let getSongs;
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Mây",
            singer: "A-202",
            path: "music/song-1.mp3",
            image: "img-music/img-music-1.jpg",
        },
        {
            name: "Gió",
            singer: "K-391",
            path: "music/song-2.mp3",
            image: "img-music/img-music-2.jpg",
        },
        {
            name: "Ngày Em Đẹp Nhất",
            singer: "A-202",
            path: "music/song-3.mp3",
            image: "img-music/img-music-3.jpg",
        },
        {
            name: "Thay Tôi Yêu Cô Ấy",
            singer: "K-391",
            path: "music/song-4.mp3",
            image: "img-music/img-music-4.jpg",
        },
        {
            name: "2 Phút Hơn",
            singer: "A-202",
            path: "music/song-5.mp3",
            image: "img-music/img-music-5.jpg",
        },
    ],

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.getItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },

    render: function () {
        const html = this.songs.map((song, index) => {
            return `
            <div class="song" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')"></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `;
        });

        playList.innerHTML = html.join("");

        const songs = $$(".song");
        getSongs = songs;
    },

    addActiveSong: function () {
        getSongs.forEach((eSong, index) => {
            eSong.classList.remove("active");
            if (index === this.currentIndex) {
                eSong.classList.add("active");
                setTimeout(
                    () =>
                        eSong.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                        }),
                    300
                );
            }
        });
    },

    random: function () {
        let getCurrentIndex = this.currentIndex;
        let randomIndex;

        do {
            randomIndex = Math.trunc(Math.random() * this.songs.length);
        } while (getCurrentIndex === randomIndex);

        this.currentIndex = randomIndex;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
    },

    handleEvents: function () {
        const cdWidth = cd.offsetWidth;
        const _this = this;

        repeatSong.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatSong.classList.toggle("active", _this.isRepeat);
        };

        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                if (randomSong.classList.contains("active")) {
                    _this.random();
                    _this.loadCurrentSong();
                    audio.play();
                    _this.addActiveSong();
                } else {
                    _this.currentIndex++;
                    if (_this.currentIndex >= _this.songs.length) {
                        _this.currentIndex = 0;
                    }
                    _this.loadCurrentSong();
                    audio.play();
                    _this.addActiveSong();
                }
            }
        };

        randomSong.onclick = function () {
            randomSong.classList.toggle("active");
            if (randomSong.classList.contains("active")) {
                _this.random();
                _this.setConfig("isRandom", _this.isRandom);
            } else {
            }
        };

        prevSong.onclick = function () {
            if (randomSong.classList.contains("active")) {
                _this.random();
                _this.loadCurrentSong();
                audio.play();
                animateCdThumb.play();
                _this.addActiveSong();
            } else {
                _this.prevSong();
                _this.loadCurrentSong();
                audio.play();
                animateCdThumb.play();
                _this.addActiveSong();
            }
        };

        nextSong.onclick = function () {
            if (randomSong.classList.contains("active")) {
                _this.random();
                _this.loadCurrentSong();
                audio.play();
                animateCdThumb.play();
                _this.addActiveSong();
            } else {
                _this.nextSong();
                _this.loadCurrentSong();
                audio.play();
                animateCdThumb.play();
                _this.addActiveSong();
            }
        };

        const animateCdThumb = cdThumb.animate(
            [{ transform: "rotate(360deg)" }],
            {
                duration: 10000,
                iterations: Infinity,
            }
        );

        animateCdThumb.pause();

        document.onscroll = function (e) {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;

            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        play.onclick = function (e) {
            if (_this.isPlaying) {
                audio.pause();
                animateCdThumb.pause();
            } else {
                audio.play();
                animateCdThumb.play();
                _this.addActiveSong();
            }
        };

        audio.onplay = function () {
            player.classList.add("playing");
            _this.isPlaying = true;
        };

        audio.onpause = function () {
            player.classList.remove("playing");
            _this.isPlaying = false;
        };

        let getCurrentTime = 0;
        audio.ontimeupdate = function (e) {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
                getCurrentTime = audio.currentTime;
            }
        };

        progress.onchange = function (e) {
            progress.value = getCurrentTime;

            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        playList.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");

            if (songNode && !e.target.closest(".option")) {
                _this.currentIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                audio.play();
                animateCdThumb.play();
                _this.addActiveSong();
            } else {
            }
        };
    },

    start: function () {
        this.defineProperties();
        this.render();
        this.handleEvents();
        this.loadCurrentSong();
    },
};

app.start();
