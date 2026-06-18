import * as Audio from './Audio.js';
import * as QuizUtils from './QuizUtils.js';
import { QUESTIONS } from "./Questions.js";

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("maxQuestions").textContent = QUESTIONS.length;
});

const maxQuestionsModal = document.getElementById("maxQuestionsModal");
const maxQuestionsMessage = document.getElementById("maxQuestionsMessage");
const errorModal = document.getElementById("errorModal");
const modalMessage = document.getElementById("modalMessage");
const closeModalBtn = document.getElementById("closeModalBtn");
const confirmModal = document.getElementById("confirmModal");
const timerInput = document.getElementById("timer");
const unlimitedCheckbox = document.getElementById("unlimitedTime");
const startButton = document.getElementById("startQuizBtn");
const questionCountInput = document.getElementById("questionCount");

const MAX_MINUTES = 3320;

function showError(message) {
    Audio.playOops();
    modalMessage.textContent = message;
    QuizUtils.openModal(errorModal);
}

function startQuiz() {
    const requestedQuestions = parseInt(questionCountInput.value);

    if (requestedQuestions > QUESTIONS.length) {
        Audio.playOops();

        maxQuestionsMessage.textContent =
            `Only ${QUESTIONS.length} questions are available.`;

        QuizUtils.openModal(maxQuestionsModal);
        return;
    }
    
    const result = QuizUtils.validateQuizSettings(
        questionCountInput,
        timerInput,
        unlimitedCheckbox,
        MAX_MINUTES
    );

    if (!result.valid) {
        if (result.requiresConfirmation) {
            Audio.playOops();
            QuizUtils.openModal(confirmModal);
            return;
        }

        showError(result.error);
        return;
    }

    QuizUtils.saveQuizSettings(
        result.questionCount,
        unlimitedCheckbox.checked,
        result.timer || 0
    );

    Audio.playDing();
    QuizUtils.goToQuiz();
}

function onEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();

        QuizUtils.handleEnter(
            event.target,
            questionCountInput,
            timerInput,
            unlimitedCheckbox,
            startQuiz
        );
    }
}

closeModalBtn.addEventListener("click", () => {
    Audio.playClick();
    QuizUtils.closeModal(errorModal);
});

document.getElementById("confirmCancelBtn").addEventListener("click", () => {
    Audio.playClick();
    QuizUtils.closeModal(confirmModal, timerInput);
});

document.getElementById("confirmOkBtn").addEventListener("click", () => {
    const questionCount = parseInt(questionCountInput.value);

    Audio.playClick();

    QuizUtils.setUnlimitedTime(
        true,
        unlimitedCheckbox,
        timerInput
    );

    QuizUtils.closeModal(confirmModal);

    if (!questionCount || questionCount < 1) {
        questionCountInput.focus();
        return;
    }

    QuizUtils.saveQuizSettings(
        questionCount,
        true,
        0
    );

    Audio.playDing();
    QuizUtils.goToQuiz();
});

unlimitedCheckbox.addEventListener("change", () => {
    Audio.playClick();

    QuizUtils.setUnlimitedTime(
        unlimitedCheckbox.checked,
        unlimitedCheckbox,
        timerInput
    );
});

startButton.addEventListener("click", startQuiz);

questionCountInput.addEventListener("keydown", onEnter);
timerInput.addEventListener("keydown", onEnter);

document.getElementById("maxQuestionsBackBtn").addEventListener("click", () => {
    Audio.playClick();
    QuizUtils.closeModal(maxQuestionsModal, questionCountInput);
});

document.getElementById("maxQuestionsSetBtn").addEventListener("click", () => {
    Audio.playClick();

    questionCountInput.value = QUESTIONS.length;

    QuizUtils.closeModal(maxQuestionsModal, startButton);
});
