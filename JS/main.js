document.addEventListener('DOMContentLoaded', () => {
  const state = {
    minutes: 25,
    seconds: 0,
    isRunning: false,
    intervalId: null,
  };

  let currentAudio = null;
  let currentButton = null;

  function playSound(soundId) {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      if (currentButton) {
        currentButton.classList.remove('clicked');
      }
    }

    const audio = document.getElementById(soundId);
    audio.loop = true;
    audio.play();
    currentAudio = audio;
  }

  function handleButtonClick(button, action) {
    button.addEventListener('click', () => {
      if (button === currentButton) {
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          button.classList.remove('clicked');
          currentAudio = null;
          currentButton = null;
        }
      } else {
        const allButtons = document.querySelectorAll('.lotr-button');
        allButtons.forEach((btn) => {
          btn.classList.remove('clicked');
        });

        button.classList.add('clicked');
        const soundId = button.getAttribute('data-sound');
        playSound(soundId);

        currentButton = button;

        if (action === 'toggleRunning') {
          toggleRunning();
        } else if (action === 'reset') {
          reset();
        } else if (action === 'increment') {
          increment();
        } else if (action === 'decrement') {
          decrement();
        }
      }
    });
  }

  function updateDisplay() {
    const formattedMinutes = state.minutes < 10 ? '0' + state.minutes : state.minutes;
    const formattedSeconds = state.seconds < 10 ? '0' + state.seconds : state.seconds;

    document.getElementById('minutes').textContent = formattedMinutes;
    document.getElementById('seconds').textContent = formattedSeconds;
  }

  function toggleRunning() {
    state.isRunning = !state.isRunning;

    if (state.isRunning) {
      state.intervalId = setInterval(updateTimer, 1000);
    } else {
      clearInterval(state.intervalId);
    }

    updateDisplay();
  }

  function updateTimer() {
    if (state.seconds > 0) {
      state.seconds -= 1;
    } else if (state.minutes > 0) {
      state.minutes -= 1;
      state.seconds = 59;
    } else {
      clearInterval(state.intervalId);
      state.isRunning = false;
      playTimerEndSound();
      reset();
    }

    updateDisplay();
  }

  function reset() {
    clearInterval(state.intervalId);
    state.isRunning = false;
    state.minutes = 25;
    state.seconds = 0;
    updateDisplay();
  }

  function increment() {
    if (!state.isRunning && state.minutes < 60) {
      state.minutes += 1;
      updateDisplay();
    }
  }

  function decrement() {
    if (!state.isRunning && state.minutes > 1) {
      state.minutes -= 1;
      updateDisplay();
    }
  }

  const controls = document.getElementById('controls');
  controls.addEventListener('click', function (event) {
    const action = event.target.getAttribute('data-action');

    if (action === 'toggleRunning') {
      toggleRunning();
    } else if (action === 'reset') {
      reset();
    } else if (action === 'increment') {
      increment();
    } else if (action === 'decrement') {
      decrement();
    }
  });

  const cardButtons = document.querySelectorAll('.lotr-button');
  cardButtons.forEach((button) => {
    const action = button.getAttribute('data-action');
    handleButtonClick(button, action);
  });
});

function playTimerEndSound() {
  var timerEndSound = document.getElementById('timerEndSound');
  if (timerEndSound) {
    timerEndSound.play();
  }
}
