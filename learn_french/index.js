let words = [];
let frenchBox = document.getElementById('french-word');
let englishBox = document.getElementById('english-word');
let frenchWord = '';
let englishWord = '';

fetch('common_french_word.csv') 
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

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }


function getRandomWord() {
    let randomIndex = Math.floor(Math.random() * words.length);
    frenchWord = words[randomIndex][1];
    frenchBox.value = frenchWord;
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

englishBox.addEventListener('input', checkEnglishWord);




