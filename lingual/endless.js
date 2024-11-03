let knownBox = document.getElementById('known-box');
let learningBox = document.getElementById('learning-box');
let knownLanguage = localStorage.getItem('knownLanguage');
let learningLanguage = localStorage.getItem('learningLanguage');
console.log('This is the known language:', knownLanguage);
console.log('This is the learning language:', learningLanguage);
let learningWord;
let knownWord;
let knownWordList = [];
let learningWordList = [];


document.getElementById('learning-flag').src = `assets/${learningLanguage}_flag.svg`;
document.getElementById('known-flag').src = `assets/${knownLanguage}_flag.svg`;

async function initialize() {
    await loadWords();
    getRandomWord();
}

initialize();
async function loadWords() {
    await Promise.all([
        fetch(`word_lists/common_${knownLanguage}_words.csv`) 
        .then(response => response.text())
        .then(data => {
            Papa.parse(data, {
                header: false,
                complete: function(results) {
                    knownWordList = results.data;
                    // console.log(knownWordList);
                }
            });
        })
        .catch(error => console.error('Error loading CSV:', error)),

        fetch(`word_lists/common_${learningLanguage}_words.csv`) 
        .then(response => response.text())
        .then(data => {
            Papa.parse(data, {
                header: false,
                complete: function(results) {
                    learningWordList = results.data;
                    // console.log(learningWordList);
                }
            });
        })
        .catch(error => console.error('Error loading CSV:', error))
    ]);
}

function getRandomWord() {
    let randomIndex = Math.floor(Math.random() * localStorage.getItem('difficulty'));
    console.log('Random index:', randomIndex);
    learningWord = learningWordList[randomIndex][1];
    learningBox.value = learningWord;
    knownWord = knownWordList[randomIndex][1];
    knownBox.value = '';
}

function checkKnownWord() {
    let userAnswer = knownBox.value.toLowerCase();
    if (userAnswer === knownWord) {
        knownBox.style.backgroundColor = 'lightgreen';
        knownBox.disabled = true;

        setTimeout(() => {
            knownBox.value = '';
            knownBox.style.backgroundColor = 'white';
            knownBox.disabled = false;
            getRandomWord();
        }, 1000);
    }
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function skipWord() {
    knownBox.value = knownWord;
    knownBox.style.backgroundColor = '#f9747f';
    knownBox.disabled = true;
    setTimeout(() => {
        knownBox.style.backgroundColor = 'white';
        knownBox.disabled = false;
        getRandomWord();
    }, 2000);
}

knownBox.addEventListener('input', checkKnownWord);