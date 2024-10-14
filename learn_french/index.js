let words = [];
let otherBox = document.getElementById('other-word');
let englishBox = document.getElementById('english-word');
let currentLanguage = 'french';
let otherWord = '';
let englishWord = '';

function loadWords() {
    fetch(`common_${currentLanguage}_words.csv`) 
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
    let randomIndex = Math.floor(Math.random() * words.length);
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

changeLanguage('french');
englishBox.addEventListener('input', checkEnglishWord);




