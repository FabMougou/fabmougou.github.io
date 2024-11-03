let knownFlag = document.getElementById('known-flag-settings');
let learningFlag = document.getElementById('learning-flag-settings');
let difficultySlider = document.getElementById('difficulty-slider');
let difficultyLabel = document.getElementById('difficulty-label');

function initialise() {
    changeFlag();
    let difficulty = localStorage.getItem('difficulty');
    if (difficulty == null) {
        setDifficulty();
    }
    else {
        difficultySlider.value = difficulty;
        setDifficulty();
    }
}
function changeFlag() {
    let knownLanguage = localStorage.getItem('knownLanguage');
    let learningLanguage = localStorage.getItem('learningLanguage');

    knownFlag.src = `assets/${knownLanguage}_flag.svg`;
    learningFlag.src = `assets/${learningLanguage}_flag.svg`;
}

function setDifficulty() {
    localStorage.setItem('difficulty', difficultySlider.value);
    difficultyLabel.innerText = difficultySlider.value;

    const green = [0, 200, 0]; // RGB values for less bright green
    const darkRed = [180, 0, 0]; // RGB values for darker red
    const factor = (difficultySlider.value - 100) / (1000 - 100);

    const r = Math.round(green[0] + factor * (darkRed[0] - green[0]));
    const g = Math.round(green[1] + factor * (darkRed[1] - green[1]));
    const b = Math.round(green[2] + factor * (darkRed[2] - green[2]));

    difficultyLabel.style.color = `rgb(${r}, ${g}, ${b})`;
    
    if (600 <= difficultySlider.value && difficultySlider.value <= 800) {
        difficultyLabel.style.animation = 'tilt-shaking 0.5s infinite';
    }

    else if (difficultySlider.value == 900) {
        difficultyLabel.style.animation = 'tilt-shaking 0.4s infinite';
    }

    else if (difficultySlider.value == 1000) {
        difficultyLabel.style.animation = 'tilt-shaking 0.3s infinite, flicker 0.2s infinite';
    }

    else {
        difficultyLabel.style.animation = 'none';
    }
}
initialise();