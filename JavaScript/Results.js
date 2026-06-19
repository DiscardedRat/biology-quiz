import * as Audio from './Audio.js';
import * as QuizUtils from './QuizUtils.js';

setTimeout(() => {
  runResults();
}, 0);

function runResults() {

const answers = JSON.parse(localStorage.getItem("answers") || "[]");
const selectedQuestions = JSON.parse(localStorage.getItem("selectedQuestions") || "[]");

const total = selectedQuestions.length;
const choicesPerQuestion = 4;
const penalty = 1 / (choicesPerQuestion - 1);

let correct = 0;
let wrong = 0;
let unanswered = 0;

const correctItems = [];
const wrongItems = [];
const unansweredItems = [];

selectedQuestions.forEach((question, i) => {
    const selected = answers[i];
    if (selected === undefined || selected === null) {
        unanswered++;
        unansweredItems.push({ question, selected, i });
    } else if (selected === question.answer) {
        correct++;
        correctItems.push({ question, selected, i });
    } else {
        wrong++;
        wrongItems.push({ question, selected, i });
    }
});

const rawScore = correct - (wrong * penalty);
const finalScore = Math.max(0, rawScore).toFixed(2);
const percentage = Math.max(0, (rawScore / total) * 100).toFixed(1);

localStorage.setItem("resultScore", finalScore);
localStorage.setItem("resultPercentage", percentage);
localStorage.setItem("resultCorrect", correct);
localStorage.setItem("resultWrong", wrong);
localStorage.setItem("resultUnanswered", unanswered);

function getScoreColor(pct) {
    const p = parseFloat(pct);
    if (p < 75)  return "#dc143c";        // crimson
    if (p < 81)  return "#f97316";        // orange
    if (p < 91)  return "#22c55e";        // green
    return "#1fd9d0";                     // blue cyan
}

const scoreColor = getScoreColor(percentage);
document.getElementById("ringPct").style.color = scoreColor;
document.getElementById("ringScore").style.color = scoreColor;

document.getElementById("correctCount").textContent = correct;
document.getElementById("wrongCount").textContent = wrong;
document.getElementById("unansweredCount").textContent = unanswered;
document.getElementById("ringScore").textContent = finalScore;
document.getElementById("ringLabel").textContent = `/ ${total}`;
document.getElementById("ringPct").textContent = `${percentage}%`;

// Ring
const circumference = 2 * Math.PI * 80;

requestAnimationFrame(() => {
    const correctEl    = document.getElementById("ringCorrect");
    const wrongEl      = document.getElementById("ringWrong");
    const unansweredEl = document.getElementById("ringUnanswered");

    [correctEl, wrongEl, unansweredEl].forEach(el => {
        el.style.strokeDasharray = `0 ${circumference}`;
        el.style.strokeDashoffset = 0;
    });

    requestAnimationFrame(() => {
        const correctDash    = (correct / total) * circumference;
        const wrongDash      = (wrong / total) * circumference;
        const unansweredDash = (unanswered / total) * circumference;

        correctEl.style.strokeDasharray    = `${correctDash} ${circumference - correctDash}`;
        correctEl.style.strokeDashoffset   = 0;

        wrongEl.style.strokeDasharray      = `${wrongDash} ${circumference - wrongDash}`;
        wrongEl.style.strokeDashoffset     = -correctDash;

        unansweredEl.style.strokeDasharray = `${unansweredDash} ${circumference - unansweredDash}`;
        unansweredEl.style.strokeDashoffset = -(correctDash + wrongDash);
    });
});

// Build dropdown
function buildDropdown(containerId, items, type) {
    const container = document.getElementById(containerId);

    if (items.length === 0) {
        container.innerHTML = `<div class="result-item" style="color:#3d6663; font-size:0.85rem;">None</div>`;
        return;
    }

    items.forEach(({ question, selected, i }) => {
        const item = document.createElement("div");
        item.className = "result-item";

        const q = document.createElement("p");
        q.className = "result-question";
        q.textContent = `Q${i + 1}. ${question.question}`;
        item.appendChild(q);

        const choices = question.shuffledChoices
            ? question.shuffledChoices.map(({ choice, index }) => ({ choice, originalIndex: index }))
            : question.choices.map((choice, index) => ({ choice, originalIndex: index }));

        choices.forEach(({ choice, originalIndex }) => {
            const btn = document.createElement("div");
            btn.className = "result-choice";
            btn.textContent = choice;

            if (type === "correct" && originalIndex === question.answer) {
                btn.classList.add("chosen-correct");
            } else if (type === "wrong") {
                if (originalIndex === selected) {
                    btn.classList.add("chosen-wrong");
                } else if (originalIndex === question.answer) {
                    btn.classList.add("correct-answer");
                }
            } else if (type === "unanswered" && originalIndex === question.answer) {
                btn.classList.add("correct-answer");
            }

            item.appendChild(btn);
        });

        container.appendChild(item);
    });
}

buildDropdown("correctDropdown", correctItems, "correct");
buildDropdown("wrongDropdown", wrongItems, "wrong");
buildDropdown("unansweredDropdown", unansweredItems, "unanswered");

// Toggle dropdowns
function setupToggle(btnId, dropdownId) {
    const btn = document.getElementById(btnId);
    const dropdown = document.getElementById(dropdownId);

    btn.addEventListener("click", () => {
        Audio.playClick();
        btn.classList.toggle("open");
        dropdown.classList.toggle("open");
    });
}

setupToggle("correctBtn", "correctDropdown");
setupToggle("wrongBtn", "wrongDropdown");
setupToggle("unansweredBtn", "unansweredDropdown");

document.getElementById("retryBtn").addEventListener("click", () => {
    Audio.playClick();
    window.location.href = "../index.html";
});

const timeUsed = localStorage.getItem("timeUsed");
const timeDisplay = document.getElementById("timeUsed");

if (!timeUsed || timeUsed === "unlimited") {
    timeDisplay.textContent = "N/A";
} else {
    timeDisplay.textContent = QuizUtils.formatTime(parseInt(timeUsed));
}

infoBtn.addEventListener("click", (e) => {
    Audio.playClick();
    e.stopPropagation();
    helpPopup.classList.toggle("open");
});

document.addEventListener("click", () => {
    helpPopup.classList.remove("open");
});

setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.transition = 'opacity 0.3s ease';
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 300);
    }
  }, 50);
  
}
