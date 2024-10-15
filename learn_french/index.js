let words = [];
let currentLanguage = 'french';

let otherBox = document.getElementById('other-word');
let englishBox = document.getElementById('english-word');
let otherWord = '';
let englishWord = '';

let difficultySlider = document.getElementById('difficulty-slider');
let difficultyAmount = document.getElementById('difficulty-amount');
let difficulty = difficultySlider.value;

function loadWords() {
    fetch(`word_lists/common_${currentLanguage}_words.csv`) 
    .then(response => response.text())
    .then(data => {
        Papa.parse(data, {
            header: false,
            complete: function(results) {
                words = results.data;
                getRandomWord();
            }
        });
    })
    .catch(error => console.error('Error loading CSV:', error));
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }


function getRandomWord() {
    let randomIndex = Math.floor(Math.random() * difficulty);
    otherWord = words[randomIndex][1];
    console.log(words[randomIndex][0]);
    otherBox.value = otherWord;
    englishWord = words[randomIndex][2];
    englishBox.value = '';
}

async function checkEnglishWord() {
    let userAnswer = englishBox.value.toLowerCase();
    if (userAnswer === englishWord) {
        englishBox.style.backgroundColor = 'lightgreen';
        await delay(1000);
        getRandomWord();
        englishBox.style.backgroundColor = 'white';
    }
}

async function skipWord() {
    englishBox.value = englishWord;
    englishBox.style.backgroundColor = 'lightcoral';
    englishBox.disabled = true;
    await delay(2000);
    getRandomWord();
    englishBox.disabled = false;
    englishBox.style.backgroundColor = 'white';
}

function changeLanguage(language) {
    document.getElementById(`${currentLanguage}-selector`).style.display = 'block';
    currentLanguage = language;

    document.getElementById(`${language}-selector`).style.display = 'none';
    document.getElementById('current-flag').src = `images/${language}_flag.svg`;
    document.getElementById('current-language').innerText = language.charAt(0).toUpperCase() + language.slice(1);
    document.getElementById('other-flag').src = `images/${language}_flag.svg`;
    loadWords();
}

function changeDifficulty() {
    difficulty = difficultySlider.value;
    difficultyAmount.innerText = difficulty;
    
    const blue = [0, 0, 255]; 
    const red = [255, 0, 0]; 
    const factor = (difficulty - 100) / (1000 - 100);

    const r = Math.round(blue[0] + factor * (red[0] - blue[0]));
    const g = Math.round(blue[1] + factor * (red[1] - blue[1]));
    const b = Math.round(blue[2] + factor * (red[2] - blue[2]));
    console.log(r, g, b);

    difficultyAmount.style.color = `rgb(${r}, ${g}, ${b})`;

}

changeLanguage('french');
englishBox.addEventListener('input', checkEnglishWord);




