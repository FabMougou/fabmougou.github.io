let knownBox = document.getElementById('known-box');
let learningBox = document.getElementById('learning-box');
let knownLanguage = localStorage.getItem('knownLanguage');
let learningLanguage = localStorage.getItem('learningLanguage');
let scoreSpan = document.getElementById('score');
let wordsLeftSpan = document.getElementById('words-left');
let classicModal = document.getElementById('classic-modal');
let finalScore = document.getElementById('final-score');
let learningWord;
let knownWord;
let knownWordList = [];
let learningWordList = [];
let combinedWordList = [];


let count = 0;
let correct = 0;

document.getElementById('learning-flag').src = `assets/${learningLanguage}_flag.svg`;
document.getElementById('known-flag').src = `assets/${knownLanguage}_flag.svg`;

async function initialize() {
    await loadWords();

    for (let i = 0; i < localStorage.getItem('difficulty'); i++) {
        combinedWordList.push([knownWordList[i][0], learningWordList[i][1], knownWordList[i][1]]);
    }

    combinedWordList.sort(() => Math.random() - 0.5);

    scoreSpan.innerText = `0/${combinedWordList.length}`;
    wordsLeftSpan.innerText = `${combinedWordList.length} words left`;

    getWord();


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

function getWord() {
    if (count < combinedWordList.length) {
        learningWord = combinedWordList[count][1];
        learningBox.value = learningWord;
        knownWord = combinedWordList[count][2];
        knownBox.value = '';
        count++;
    } else {
        finalScore.innerText = `${correct}/${combinedWordList.length}`;
        classicModal.showModal();
    }
}

function checkKnownWord() {
    let userAnswer = knownBox.value.toLowerCase();
    if (userAnswer === knownWord) {
        wordsLeftSpan.innerText = `${combinedWordList.length - count} words left`;
        correct++;
        scoreSpan.innerText = `${correct}/${combinedWordList.length}`;
        knownBox.style.backgroundColor = 'lightgreen';
        knownBox.disabled = true;

        setTimeout(() => {
            knownBox.value = '';
            knownBox.style.backgroundColor = 'white';
            knownBox.disabled = false;
            getWord();
        }, 1000);
    }
}

function skipWord() {
    wordsLeftSpan.innerText = `${combinedWordList.length - count} words left`;
    knownBox.value = knownWord;
    knownBox.style.backgroundColor = '#f9747f';
    knownBox.disabled = true;
    setTimeout(() => {
        knownBox.style.backgroundColor = 'white';
        knownBox.disabled = false;
        getWord();
    }, 2000);
}

knownBox.addEventListener('input', checkKnownWord);