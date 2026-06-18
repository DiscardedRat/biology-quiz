function openModal(modal) {
    modal.style.display = "flex";
    document.body.classList.add("modal-open");
}

function closeModal(modal, focusElement = null) {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");

    if (focusElement) {
        focusElement.focus();
    }
}

function saveQuizSettings(questionCount, unlimited, timer) {
    localStorage.setItem("questionCount", questionCount);
    localStorage.setItem("unlimitedTime", unlimited);
    localStorage.setItem("timerMinutes", timer);
}

function goToQuiz(delay = 400) {
    setTimeout(() => {
        window.location.href = "HTML/Quiz.html";
    }, delay);
}

function setUnlimitedTime(enabled, checkbox, timerInput) {
    checkbox.checked = enabled;
    timerInput.disabled = enabled;

    if (enabled) {
        timerInput.value = "";
    }
}

function getFirstInvalidField(
    questionCountInput,
    timerInput,
    unlimitedCheckbox
) {
    const questionCount = parseInt(questionCountInput.value);
    const timer = parseInt(timerInput.value);

    if (!questionCount || questionCount < 1) {
        return questionCountInput;
    }

    if (
        !unlimitedCheckbox.checked &&
        (!timer || timer < 1)
    ) {
        return timerInput;
    }

    return null;
}

function handleEnter(
    currentField,
    questionCountInput,
    timerInput,
    unlimitedCheckbox,
    startQuiz
) {
    const invalidField = getFirstInvalidField(
        questionCountInput,
        timerInput,
        unlimitedCheckbox
    );

    if (invalidField) {
        invalidField.focus();
        return;
    }

    if (
        currentField === questionCountInput &&
        !unlimitedCheckbox.checked
    ) {
        timerInput.focus();
    } else {
        startQuiz();
    }
}

function validateQuizSettings(
    questionCountInput,
    timerInput,
    unlimitedCheckbox,
    maxMinutes
) {
    const questionCount = parseInt(questionCountInput.value);
    const timer = parseInt(timerInput.value);

    if (
        (!questionCount || questionCount < 1) &&
        !unlimitedCheckbox.checked &&
        (!timer || timer < 1)
    ) {
        return {
            valid: false,
            error: "Please fill in the required fields."
        };
    }

    if (!questionCount || questionCount < 1) {
        return {
            valid: false,
            error: "Please enter a valid number of questions."
        };
    }

    if (!unlimitedCheckbox.checked) {
        if (!timer || timer < 1) {
            return {
                valid: false,
                error: "Time limit must be at least 1 minute."
            };
        }

        if (timer > maxMinutes) {
            return {
                valid: false,
                requiresConfirmation: true
            };
        }
    }

    return {
        valid: true,
        questionCount,
        timer
    };
}

function loadQuizSettings() {
    return {
        questionCount: parseInt(localStorage.getItem("questionCount")),
        unlimitedTime: localStorage.getItem("unlimitedTime") === "true",
        timerMinutes: parseInt(localStorage.getItem("timerMinutes"))
    };
}

function saveQuizResults(
    answers,
    selectedQuestions,
    timeUsed
) {
    localStorage.setItem(
        "answers",
        JSON.stringify(answers)
    );

    localStorage.setItem(
        "selectedQuestions",
        JSON.stringify(selectedQuestions)
    );

    localStorage.setItem(
        "timeUsed",
        timeUsed
    );
}

function getMissingQuestions(
    answers,
    questionCount
) {
    const missing = [];

    for (let i = 0; i < questionCount; i++) {
        if (
            answers[i] === undefined ||
            answers[i] === null
        ) {
            missing.push(i + 1);
        }
    }

    return missing;
}

function formatTime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days >= 1 && (hours > 0 || mins > 0 || secs > 0)) {
        const time = [hours, mins, secs]
            .map(v => v.toString().padStart(2, "0"))
            .join(":");
        return `${days} day${days > 1 ? "s" : ""} | ${time}`;
    }

    if (days >= 1) {
        return `${days} day${days > 1 ? "s" : ""}`;
    }

    if (hours >= 1) {
        return [hours, mins, secs]
            .map(v => v.toString().padStart(2, "0"))
            .join(":");
    }

    return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
}

export {
    openModal,
    closeModal,
    saveQuizSettings,
    goToQuiz,
    setUnlimitedTime,
    handleEnter,
    validateQuizSettings,
    loadQuizSettings,
    saveQuizResults,
    getMissingQuestions,
    formatTime
};

