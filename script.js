const music = document.getElementById("birthdayMusic");

const screens = document.querySelectorAll(".screen");

const enterButton = document.getElementById("enterButton");

const yesButton = document.getElementById("yesButton");

const noButton = document.getElementById("noButton");

const tryAgainButton = document.getElementById("tryAgainButton");

const nextButtons = document.querySelectorAll(".next-button");

const countdownNumber = document.getElementById("countdownNumber");

const kissButton = document.getElementById("kissButton");

const kissCountElement = document.getElementById("kissCount");

const kissMessage = document.getElementById("kissMessage");

const kissContinue = document.getElementById("kissContinue");


/* ==========================================
   GOOGLE SHEETS CONNECTION
========================================== */

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzqnJEwxCxrhaY77kR_LfodFKsooYbucWhiJRYapVmneRvI4NWPS-DLDC60xpiJEFjiXA/exec";


/* ==========================================
   SCREEN CONTROL
========================================== */

function showScreen(screenId) {

    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    const nextScreen = document.getElementById(screenId);

    if (nextScreen) {

        setTimeout(() => {
            nextScreen.classList.add("active");
        }, 100);

    }
}


/* ==========================================
   MUSIC
========================================== */

function startMusic() {

    music.volume = 0.55;

    /*
        1:58 = 118 seconds
    */

    music.currentTime = 48;

    music.play().catch(() => {
        console.log("Music needs user interaction");
    });
}


/* ==========================================
   OPENING
========================================== */

enterButton.addEventListener("click", () => {

    startMusic();

    showScreen("countdownScreen");

    startCountdown();

});


/* ==========================================
   10 SECOND COUNTDOWN
========================================== */

let countdownStarted = false;

function startCountdown() {

    if (countdownStarted) {
        return;
    }

    countdownStarted = true;

    let number = 10;

    countdownNumber.textContent = number;

    const countdownInterval = setInterval(() => {

        number--;

        if (number > 0) {

            countdownNumber.textContent = number;

        } else {

            clearInterval(countdownInterval);

            countdownNumber.textContent = "❤️";

            setTimeout(() => {

                showScreen("messageOne");

            }, 800);

        }

    }, 1000);

}


/* ==========================================
   NEXT BUTTONS
========================================== */

nextButtons.forEach(button => {

    button.addEventListener("click", () => {

        const nextScreen = button.dataset.next;

        if (nextScreen) {
            showScreen(nextScreen);
        }

    });

});


/* ==========================================
   KISSES COUNTER
========================================== */

let kissCount = 0;

kissButton.addEventListener("click", () => {

    kissCount++;

    kissCountElement.textContent =
        `💋 ${kissCount}`;

    kissCountElement.classList.remove("pop");

    void kissCountElement.offsetWidth;

    kissCountElement.classList.add("pop");

    createKissParticles();

    updateKissMessage();

});


function updateKissMessage() {

    if (kissCount === 1) {

        kissMessage.textContent =
            "Okay just one to start💋";

    } else if (kissCount === 5) {

        kissMessage.textContent =
            "Hmmmm I definitely owe you more🥺❤️";

    } else if (kissCount === 10) {

        kissMessage.textContent =
            "Ten already and I am not even sorry💋";

    } else if (kissCount === 25) {

        kissMessage.textContent =
            "25 kisses and still counting👀💋";

    } else if (kissCount === 50) {

        kissMessage.textContent =
            "Fifty kisses for my favorite person❤️";

    } else if (kissCount === 100) {

        kissMessage.textContent =
            "Okay fine you deserve unlimited kisses😭💋";

    } else if (kissCount > 100) {

        kissMessage.textContent =
            "There is no limit anymore💋❤️";

    }

}


function createKissParticles() {

    const particles = [
        "💋",
        "❤️",
        "💕",
        "💋",
        "❤️"
    ];

    for (let i = 0; i < 8; i++) {

        const particle =
            document.createElement("div");

        particle.className = "kiss-particle";

        particle.textContent =
            particles[
                Math.floor(
                    Math.random() * particles.length
                )
            ];

        particle.style.left = "50%";
        particle.style.top = "48%";

        particle.style.setProperty(
            "--x",
            `${(Math.random() - 0.5) * 300}px`
        );

        particle.style.setProperty(
            "--y",
            `${(Math.random() - 0.5) * 300}px`
        );

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1400);

    }

}


/* ==========================================
   KISS COUNTER CONTINUE
========================================== */

kissContinue.addEventListener("click", () => {

    showScreen("questionScreen");

});


/* ==========================================
   GENERATE VISITOR ID
========================================== */

function getVisitorId() {

    let visitorId =
        localStorage.getItem("birthdayVisitorId");

    if (!visitorId) {

        visitorId =
            "visitor-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 10);

        localStorage.setItem(
            "birthdayVisitorId",
            visitorId
        );

    }

    return visitorId;
}


/* ==========================================
   SAVE ANSWER ONLINE
========================================== */

function saveAnswer(answer) {

    const data = {

        answer: answer,

        device:
            navigator.userAgent,

        visitorId:
            getVisitorId()

    };

    /*
        no-cors allows the static website
        to send the request to Google Apps Script
    */

    fetch(GOOGLE_SCRIPT_URL, {

        method: "POST",

        mode: "no-cors",

        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },

        body: JSON.stringify(data)

    }).catch(error => {

        console.log(
            "Online answer could not be saved:",
            error
        );

    });

}


/* ==========================================
   YES BUTTON
========================================== */

yesButton.addEventListener("click", () => {

    localStorage.setItem(
        "birthdayAnswer",
        "YES"
    );

    saveAnswer("YES");

    createHeartExplosion();

    showScreen("yesScreen");

});


/* ==========================================
   NO BUTTON
========================================== */

noButton.addEventListener("click", () => {

    localStorage.setItem(
        "birthdayAnswer",
        "NO"
    );

    saveAnswer("NO");

    showScreen("noScreen");

});


/* ==========================================
   TRY AGAIN
========================================== */

tryAgainButton.addEventListener("click", () => {

    localStorage.setItem(
        "birthdayAnswer",
        "YES_AFTER_NO"
    );

    saveAnswer("YES_AFTER_NO");

    createHeartExplosion();

    showScreen("yesScreen");

});


/* ==========================================
   HEART EXPLOSION
========================================== */

function createHeartExplosion() {

    const hearts = [
        "❤️",
        "💋",
        "❤️",
        "💋",
        "💕",
        "❤️",
        "💋"
    ];

    for (let i = 0; i < 30; i++) {

        const heart =
            document.createElement("div");

        heart.textContent =
            hearts[
                Math.floor(
                    Math.random() * hearts.length
                )
            ];

        heart.style.position = "fixed";

        heart.style.left = "50%";

        heart.style.top = "50%";

        heart.style.fontSize =
            `${Math.random() * 25 + 15}px`;

        heart.style.pointerEvents = "none";

        heart.style.zIndex = "9999";

        const x =
            (Math.random() - 0.5) *
            window.innerWidth;

        const y =
            (Math.random() - 0.5) *
            window.innerHeight;

        heart.animate(
            [
                {
                    transform:
                        "translate(-50%,-50%) scale(0)",
                    opacity: 1
                },
                {
                    transform:
                        `translate(${x}px,${y}px) scale(1.2)`,
                    opacity: 0
                }
            ],
            {
                duration:
                    Math.random() * 1500 + 1000,

                easing: "ease-out"
            }
        );

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 2600);

    }

}


/* ==========================================
   KEEP MUSIC PLAYING
========================================== */

music.addEventListener("ended", () => {

    music.currentTime = 48;

    music.play().catch(() => {});

});