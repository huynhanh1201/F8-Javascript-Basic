const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "HUYNH_ANH_PLAYER";

const playlist = $(".playlist");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const player = $(".player");
const playBtn = $(".btn-toggle-play");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const repeatBtn = $(".btn-repeat");
const randomBtn = $(".btn-random");
const progress = $("#progress");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    listIndexPlayed: [],
    songs: [
        {
            name: "Song 1",
            singer: "Singer 1",
            path: "/assets/music/song-1.mp3",
            image: "/assets/img/song-1.jpg",
        },
        {
            name: "Song 2",
            singer: "Singer 2",
            path: "/assets/music/song-2.mp3",
            image: "/assets/img/song-2.jpg",
        },
        {
            name: "Song 3",
            singer: "Singer 3",
            path: "/assets/music/song-3.mp3",
            image: "/assets/img/song-3.jpg",
        },
        {
            name: "Song 4",
            singer: "Singer 4",
            path: "/assets/music/song-4.mp3",
            image: "/assets/img/song-4.jpg",
        },
        {
            name: "Song 5",
            singer: "Singer 5",
            path: "/assets/music/song-5.mp3",
            image: "/assets/img/song-5.jpg",
        },
    ],

    // Define properties
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    // Handle evens
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        const cdThumbAnimate = cdThumb.animate(
            [{ transform: "rotate(360deg)" }],
            {
                duration: 10000,
                iterations: Infinity,
            }
        );

        cdThumbAnimate.pause();

        document.onscroll = function () {
            const scrollTop =
                window.scrollY || window.document.documentElement.scrollTop;

            const newWidth = cdWidth - scrollTop;

            cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
            cd.style.opacity = newWidth / cdWidth;
        };

        playBtn.onclick = function () {
            if (!_this.isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }
        };

        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.toggle("playing", _this.isPlaying);
            cdThumbAnimate.play();
        };

        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.toggle("playing", _this.isPlaying);
            cdThumbAnimate.pause();
        };

        audio.ontimeupdate = function () {
            if (audio.currentTime) {
                const durationSong = audio.duration;
                const currentTime = audio.currentTime;
                const percentTime = Math.floor(
                    (currentTime / durationSong) * 100
                );

                progress.value = percentTime;
            }
        };

        progress.onchange = function (e) {
            const durationSong = audio.duration;
            const seek = (durationSong / 100) * e.target.value;

            audio.currentTime = seek;
        };

        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.random();
            } else {
                _this.next();
            }
            _this.render();
            _this.scrollIntoView();
            audio.play();
        };

        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.random();
            } else {
                _this.prev();
            }
            _this.render();
            _this.scrollIntoView();
            audio.play();
        };

        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
        };

        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");
            if (songNode && !e.target.closest(".option")) {
                const dataIndex = songNode.dataset.index;

                _this.currentIndex = dataIndex;
                _this.render();
                _this.loadCurrentSong();
                audio.play();
                console.log(dataIndex);
            }
        };
    },

    // Method
    render: function () {
        const html = this.songs.map((song, index) => {
            return `
            <div class="song ${
                index == this.currentIndex ? "active" : ""
            }" data-index = '${index}' >
                    <div
                        class="thumb"
                        style="
                            background-image: url('${song.image}');
                        "
                    ></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`;
        });

        playlist.innerHTML = html.join("");
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },

    next: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prev: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    random: function () {
        let randomIndex;
        let isRandomIndex = true;

        if (this.listIndexPlayed.length === this.songs.length - 1) {
            this.listIndexPlayed = [];
        }
        while (isRandomIndex) {
            randomIndex = Math.floor(Math.random() * this.songs.length);

            if (
                randomIndex !== this.currentIndex &&
                this.checkListIndexPlayed(randomIndex, this.listIndexPlayed)
            ) {
                this.listIndexPlayed.push(randomIndex);
                isRandomIndex = false;
            }
        }

        console.log(randomIndex);
        console.log(this.listIndexPlayed);
        this.currentIndex = randomIndex;
        this.loadCurrentSong();
    },

    checkListIndexPlayed: function (randomIndex, listIndex) {
        let isIndex = true;
        listIndex.forEach((eIndex) => {
            if (randomIndex === eIndex) {
                isIndex = false;
            }
        });
        return isIndex;
    },
    scrollIntoView: function () {
        $(".song.active").scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    start: function () {
        this.loadConfig();

        this.defineProperties();

        this.render();

        this.handleEvents();

        this.loadCurrentSong();

        repeatBtn.classList.toggle("active", this.isRepeat);
        randomBtn.classList.toggle("active", this.isRandom);
    },
};

app.start();
