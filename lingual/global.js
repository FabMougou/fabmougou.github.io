console.log(localStorage.getItem('knownLanguage'));

if (localStorage.getItem('knownLanguage') == null) {
    console.log('No language set, setting to default');
    localStorage.setItem('knownLanguage', 'english');
    localStorage.setItem('learningLanguage', 'french');
    localStorage.setItem('difficulty', 100);
    console.log(localStorage.getItem('difficulty'));
}

function setKnownLanguage(language) {
    localStorage.setItem('knownLanguage', language);
    console.log('Language set to', language);
}

function setLearningLanguage(language) {
    localStorage.setItem('learningLanguage', language);
    console.log('Learning language set to', language);
}