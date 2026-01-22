/* All Work Related to the Timer Made in part with Mateusz Rybczonek's guide linked on index.html */
const TIME_LIMIT = 1800;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;

const EARLY_THRESHOLD = 900;
const MINUTE_THRESHOLD = 60;
const FINISH_THRESHOLD = 0;

const COLOR_CODES = {
    early: { color: "yellow" },
    minute: { color: "orange", threshold: MINUTE_THRESHOLD },
    finish: { color: "green", threshold: FINISH_THRESHOLD }
};

function remainingPathColor() {
    const { early, minute, finish } = COLOR_CODES;
    if (timeLeft <= finish.threshold) {
        return finish.color;
    } else if (timeLeft <= minute.threshold) {
        return minute.color;
    } else {
        return early.color;
    }
}

document.getElementById("app").innerHTML = `
    <div class="base-timer">
        <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
            <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor()}"
            d="
            M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
            "
            ></path>
        </g>
    </svg>
    <span id="base-timer-label" class="base-timer__label">
    ${formatTimeLeft(timeLeft)}
    </span>
    </div>
`;

let panelOpen = false;

function togglePanel() {
    const panel = document.getElementById('timerPanel');
    const arrow = document.getElementById('arrow');
    
    if (panelOpen) {
        panel.classList.add('hidden');
        arrow.textContent = '◀';
        panelOpen = false;
    } else {
        panel.classList.remove('hidden');
        arrow.textContent = '▶';
        panelOpen = true;
    }
}

window.addEventListener('load', function() {
    setTimeout(() => {
        togglePanel();
    }, 500);
});

function startTimer() {
    document.getElementById("startButton").disabled = true;
    timerInterval = setInterval(() => {
        timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        document.getElementById("base-timer-label").innerHTML = formatTimeLeft(timeLeft);
        setCircleDasharray();
        setRemainingPathColor(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
}

function formatTimeLeft(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * 283
    ).toFixed(0)} 283`;
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}

function setRemainingPathColor(timeLeft) {
    const { early, minute, finish } = COLOR_CODES;
    if (timeLeft <= finish.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(early.color, minute.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(finish.color);
    } else if (timeLeft <= minute.threshold) {
        document
            .getElementById("base-timer-path-remaining")
            .classList.remove(early.color);
        document
            .getElementById("base-timer-path-remaining")
            .classList.add(minute.color);
    }
}