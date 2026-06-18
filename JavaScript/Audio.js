const audioCtx = new AudioContext();

function playClick() {
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
        800,
        audioCtx.currentTime + 0.05
    );

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.05
    );

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.05);
}

function playDing() {
    [523, 659, 784].forEach((freq, i) => {
        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(
            freq,
            audioCtx.currentTime + i * 0.12
        );

        gain.gain.setValueAtTime(
            0,
            audioCtx.currentTime + i * 0.12
        );

        gain.gain.linearRampToValueAtTime(
            0.3,
            audioCtx.currentTime + i * 0.12 + 0.01
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + i * 0.12 + 0.4
        );

        oscillator.start(audioCtx.currentTime + i * 0.12);
        oscillator.stop(audioCtx.currentTime + i * 0.12 + 0.4);
    });
}

function playOops() {
    [400, 300].forEach((freq, i) => {
        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            freq,
            audioCtx.currentTime + i * 0.12
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            freq * 0.75,
            audioCtx.currentTime + i * 0.12 + 0.15
        );

        gain.gain.setValueAtTime(
            0,
            audioCtx.currentTime + i * 0.12
        );

        gain.gain.linearRampToValueAtTime(
            1.5,
            audioCtx.currentTime + i * 0.12 + 0.01
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + i * 0.12 + 0.2
        );

        oscillator.start(audioCtx.currentTime + i * 0.12);
        oscillator.stop(audioCtx.currentTime + i * 0.12 + 0.2);
    });
}

export {
    playClick,
    playDing,
    playOops
};