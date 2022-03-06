const timeline = [{
        year: 1985,
        month: 09,
        month_name: "1985 九月",
        title: "超級瑪利歐兄弟"
    },
    {
        year: 1986,
        month: 06,
        month_name: "1986 六月",
        title: "超級瑪利歐兄弟2日版"
    },
    {
        year: 1988,
        month: 10,
        month_name: "1988 十月",
        title: "超級瑪利歐兄弟3"
    },
    {
        year: 1988,
        month: 11,
        month_name: "1988 十一月",
        title: "瑪利歐兄弟再現江湖"
    },
    {
        year: 1989,
        month: 04,
        month_name: "1989 四月",
        title: "超級瑪利歐GB"
    },
    {
        year: 1990,
        month: 11,
        month_name: "1990 十一月",
        title: "超級瑪利歐世界"
    },
    {
        year: 1992,
        month: 10,
        month_name: "1992 十月",
        title: "超級瑪利歐GB2"
    },
    {
        year: 1995,
        month: 08,
        month_name: "1995 八月",
        title: "耀西之島"
    },
    {
        year: 1996,
        month: 06,
        month_name: "1996 六月",
        title: "超級瑪利歐64"
    },
    {
        year: 2002,
        month: 07,
        month_name: "2002 七月",
        title: "陽光瑪利歐"
    },
    {
        year: 2006,
        month: 05,
        month_name: "2006 五月",
        title: "New 超級瑪利歐兄弟"
    },
    {
        year: 2007,
        month: 11,
        month_name: "2007 十一月",
        title: "超級瑪利歐銀河"
    },
    {
        year: 2010,
        month: 07,
        month_name: "2010 七月",
        title: "New 超級瑪利歐兄弟Wii"
    },
    {
        year: 2010,
        month: 12,
        month_name: "2010 十二月",
        title: "超級瑪利歐銀河2"
    },
    {
        year: 2011,
        month: 11,
        month_name: "2011 十一月",
        title: "超級瑪利歐3D 樂園"
    },
    {
        year: 2012,
        month: 08,
        month_name: "2012 八月",
        title: "New 超級瑪利歐兄弟2"
    },
    {
        year: 2012,
        month: 11,
        month_name: "2012 十一月",
        title: "New 超級瑪利歐兄弟U"
    },
    {
        year: 2013,
        month: 11,
        month_name: "2013 十一月",
        title: "超級瑪利歐3D"
    },
    {
        year: 2015,
        month: 09,
        month_name: "2015 九月",
        title: "超級瑪利歐創作家"
    },
    {
        year: 2016,
        month: 12,
        month_name: "2016 十二月",
        title: "超級瑪利歐酷跑"
    },
    {
        year: 2017,
        month: 10,
        month_name: "2017 十月",
        title: "超級瑪利歐奧德賽"
    },
    {
        year: 2019,
        month: 06,
        month_name: "2019 六月",
        title: "超級瑪利歐創作家2"
    },
    {
        year: 2021,
        month: 02,
        month_name: "2021 2月",
        title: "超級瑪利歐3D 世界 + 狂怒世界"
    }
];

const mario = document.getElementById("mario");
const ground = document.getElementById("ground");
const grass = document.getElementById("grass");
const eventsContainer = document.getElementById("events");
let currentIndex = -1;
let currentPipe;
let int1;

const pipeHandler = (event) => {
    clearInterval(int1);

    document.getElementById("info").style.display = "none";

    !currentPipe || currentPipe.classList.remove("active");

    const index = parseInt(event.currentTarget.dataset.index);

    const xpos = -100 - index * 150 - 25;
    const curXpos = -100 - currentIndex * 150 - 25;
    const distance = curXpos - xpos;
    const duration = Math.abs(distance) * 3;
    eventsContainer.style.transitionDuration = `${duration}ms`;
    eventsContainer.style.transform = `translateX(${xpos}px)`;
    ground.style.transitionDuration = `${duration}ms`;
    ground.style.backgroundPosition = `${xpos}px 32px`;
    grass.style.transitionDuration = `${duration}ms`;
    grass.style.backgroundPosition = `${xpos}px 0`;

    playSfx("jump");

    const dir = distance < 0 ? "left" : "right";
    mario.classList.remove(
        "idle",
        "walk-left",
        "walk-right",
        "search-left",
        "search-right"
    );
    mario.classList.add(`walk-${dir}`);
    int1 = setTimeout(
        (dir, target) => {
            mario.classList.remove(`walk-${dir}`);
            mario.classList.add(`search-${dir}`);
            target.classList.add("active");
            playSfx("pipe");
        },
        duration,
        dir,
        event.currentTarget
    );

    currentIndex = index;
    currentPipe = event.currentTarget;
};

timeline.forEach((event, index) => {
    const e = document.createElement("div");
    e.classList.add("event");
    e.dataset.index = index;
    e.dataset.title = event.title;
    e.dataset.month = event.month_name;
    eventsContainer.appendChild(e);
    e.addEventListener("click", pipeHandler.bind(this));
});

const canAudio = "AudioContext" in window || "webkitAudioContext" in window;
const buffers = {};
let context = void 0;

if (canAudio) {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    var gainNode = context.createGain();
    gainNode.gain.value = 1;
}

const playSfx = function play(id) {
    if (!canAudio || !buffers.hasOwnProperty(id)) return;
    const buffer = buffers[id];
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start();
};

const loadBuffers = (urls, ids) => {
    if (typeof urls == "string") urls = [urls];
    if (typeof ids == "string") ids = [ids];
    urls.forEach((url, index) => {
        window
            .fetch(url)
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) =>
                context.decodeAudioData(
                    arrayBuffer,
                    (audioBuffer) => {
                        buffers[ids[index]] = audioBuffer;
                    },
                    (error) => console.log(error)
                )
            );
    });
};

loadBuffers(
    [
        "sounds/jump.mp3",
        "sounds/warp-pipe.mp3"
    ],
    ["jump", "pipe"]
);