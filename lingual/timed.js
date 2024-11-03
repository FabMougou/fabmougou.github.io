let knownBox = document.getElementById('known-box');
let learningBox = document.getElementById('learning-box');
let knownLanguage = localStorage.getItem('knownLanguage');
let learningLanguage = localStorage.getItem('learningLanguage');
let scoreSpan = document.getElementById('score');
let timedModal = document.getElementById('timed-modal');
let finalScore = document.getElementById('final-score');


let learningWord;
let knownWord;
let knownWordList = [];
let learningWordList = [];
let count = 0;
let correct = 0;


document.getElementById('learning-flag').src = `assets/${learningLanguage}_flag.svg`;
document.getElementById('known-flag').src = `assets/${knownLanguage}_flag.svg`;

async function initialize() {
    await loadWords();
    getRandomWord();
}

initialize();

function timer(){
    var sec = 90;
    var timer = setInterval(function(){
        var minutes = Math.floor(sec / 60).toString().padStart(2, '0');
        var seconds = (sec % 60).toString().padStart(2, '0');
        document.getElementById('timer').innerHTML= `${minutes}:${seconds}`;
        sec--;
        if (sec < 0) {
            finalScore.innerText = correct;
            timedModal.showModal();
            clearInterval(timer);
        }
    }, 1000);
}

async function loadWords() {
    await Promise.all([
        fetch(`word_lists/common_${knownLanguage}_words.csv`) 
        .then(response => response.text())
        .then(data => {
            Papa.parse(data, {
                header: false,
                complete: function(results) {
                    knownWordList = results.data;
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
                }
            });
        })
        .catch(error => console.error('Error loading CSV:', error))
    ]);
}

function getRandomWord() {
    count++;
    let randomIndex = Math.floor(Math.random() * localStorage.getItem('difficulty'));
    learningWord = learningWordList[randomIndex][1];
    learningBox.value = learningWord;
    knownWord = knownWordList[randomIndex][1];
    knownBox.value = '';
}

function checkKnownWord() {
    let userAnswer = knownBox.value.toLowerCase();
    if (userAnswer == knownWord) {
        correct++;
        scoreSpan.innerText = correct;
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
document.addEventListener('onload', timer());