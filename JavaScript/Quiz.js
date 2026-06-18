import * as Audio from './Audio.js';
import * as QuizUtils from './QuizUtils.js';
import { QUESTIONS } from './Questions.js';

window.addEventListener('load', () => {
  document.getElementById('loader').style.display = 'none';
});

const settings = QuizUtils.loadQuizSettings();

const requestedQuestions = settings.questionCount;
const unlimitedTime = settings.unlimitedTime;
const timerMinutes = settings.timerMinutes;

const currentQuestionIndex = { value: 0 };
const answers = [];

let selectedQuestions = [...QUESTIONS]
    .sort(() => Math.random() - 0.5)
    .slice(0, requestedQuestions);

const questionText = document.getElementById("questionText");
const choicesContainer = document.getElementById("choicesContainer");
const questionCounter = document.getElementById("questionCounter");
const timerDisplay = document.getElementById("timerDisplay");
const progressBar = document.getElementById("progressBar");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const submitModal = document.getElementById("submitModal");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const missingList = document.getElementById("missingList");

let secondsLeft = 0;

if (!unlimitedTime && timerMinutes >= 1) {
    secondsLeft = timerMinutes * 60;
    timerDisplay.textContent = QuizUtils.formatTime(secondsLeft);

    const timerInterval = setInterval(() => {
        secondsLeft--;
        timerDisplay.textContent = QuizUtils.formatTime(secondsLeft);

        if (secondsLeft <= 60) {
            timerDisplay.classList.add("warning");
        }

        if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            Audio.playDing();
            submitQuiz();
        }
    }, 1000);
}

const shuffledChoicesMap = {};

function renderQuestion() {
    const question = selectedQuestions[currentQuestionIndex.value];
    const total = selectedQuestions.length;
    const current = currentQuestionIndex.value + 1;

    questionCounter.textContent = `Question ${current} / ${total}`;
    progressBar.style.width = `${(current / total) * 100}%`;
    questionText.textContent = question.question;

    previousBtn.disabled = currentQuestionIndex.value === 0;
    nextBtn.disabled = currentQuestionIndex.value === total - 1;

    choicesContainer.innerHTML = "";

    // shuffle once per question, reuse after
    if (!shuffledChoicesMap[currentQuestionIndex.value]) {
        shuffledChoicesMap[currentQuestionIndex.value] = [...question.choices]
        .map((choice, index) => ({ choice, index }))
        .sort(() => Math.random() - 0.5);

        question.shuffledChoices = shuffledChoicesMap[currentQuestionIndex.value];
    }

    const shuffledChoices = shuffledChoicesMap[currentQuestionIndex.value];

    shuffledChoices.forEach(({ choice, index }) => {
        const button = document.createElement("button");
        button.className = "choice";
        button.textContent = choice;

        if (answers[currentQuestionIndex.value] === index) {
            button.classList.add("selected");
        }

        button.addEventListener("click", () => {
            Audio.playClick();
            answers[currentQuestionIndex.value] = index;
            renderQuestion();
        });

        choicesContainer.appendChild(button);
    });
}

function showSubmitModal() {
    const missing = QuizUtils.getMissingQuestions(
        answers,
        selectedQuestions.length
    );

    if (missing.length === 0) {
        Audio.playClick();
    } else {
        Audio.playOops();
    }

    const confirmBtn = document.getElementById("modalConfirmBtn");

    missingList.innerHTML = "";

    if (missing.length === 0) {
        modalTitle.textContent = "Submit Quiz?";
        modalSubtitle.textContent = "All questions answered. Ready to submit?";
        missingList.style.display = "none";
        confirmBtn.textContent = "Submit";
    } else {
        modalTitle.textContent = "Unanswered Questions";
        modalSubtitle.textContent =
            `You skipped ${missing.length} question${missing.length > 1 ? "s" : ""}:`;

        missingList.style.display = "flex";

        missing.forEach(n => {
            const item = document.createElement("button");
            item.className = "missing-item";
            item.textContent = `Question ${n}`;

            item.addEventListener("click", () => {
                Audio.playClick();
                currentQuestionIndex.value = n - 1;
                renderQuestion();
                closeSubmitModal();
            });

            missingList.appendChild(item);
        });

        confirmBtn.textContent = "Submit anyway";
    }

    QuizUtils.openModal(submitModal);
}

function closeSubmitModal() {
    Audio.playClick();
    QuizUtils.closeModal(submitModal);
    document.getElementById("modalConfirmBtn").style.display = "";
    document.getElementById("modalBackBtn").textContent = "Back";
}

function submitQuiz() {
    const timeUsed = unlimitedTime
        ? "unlimited"
        : (timerMinutes * 60) - secondsLeft;

    QuizUtils.saveQuizResults(
        answers,
        selectedQuestions,
        timeUsed
    );

    setTimeout(() => {
        window.location.href = "Results.html";
    }, 400);
}

previousBtn.addEventListener("click", () => {
    Audio.playClick();
    if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--;
        renderQuestion();
    }
});

nextBtn.addEventListener("click", () => {
    Audio.playClick();
    if (currentQuestionIndex.value < selectedQuestions.length - 1) {
        currentQuestionIndex.value++;
        renderQuestion();
    }
});

document.getElementById("jumpBtn").addEventListener("click", () => {
    Audio.playClick();

    const jumpInput = document.getElementById("jumpInput");
    const target = parseInt(jumpInput.value);

    if (!jumpInput.value) {
        modalTitle.textContent = "Jump to Question";
        modalSubtitle.textContent =
            `Type a question number from 1 to ${selectedQuestions.length}, then press Go to jump straight to it.`;

        missingList.style.display = "none";
        document.getElementById("modalConfirmBtn").style.display = "none";
        document.getElementById("modalBackBtn").textContent = "Got it";

        QuizUtils.openModal(submitModal);
        return;
    }

    if (target >= 1 && target <= selectedQuestions.length) {
        currentQuestionIndex.value = target - 1;
        jumpInput.value = "";
        renderQuestion();
    }
});

document.getElementById("submitBtn")
    .addEventListener("click", showSubmitModal);

document.getElementById("modalBackBtn")
    .addEventListener("click", closeSubmitModal);

document.getElementById("modalConfirmBtn")
    .addEventListener("click", () => {
        Audio.playDing();
        submitQuiz();
    });

submitModal.addEventListener("click", (e) => {
    if (e.target === submitModal) {
        closeSubmitModal();
    }
});

renderQuestion();
