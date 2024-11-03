if (localStorage.getItem('knownLanguage') == null) {
    console.log('No language set, setting to default');
    localStorage.setItem('knownLanguage', 'english');
    localStorage.setItem('learningLanguage', 'french');
}

function setKnownLanguage(language) {
    localStorage.setItem('knownLanguage', language);
    console.log('Language set to', language);
}

function setLearningLanguage(language) {
    localStorage.setItem('learningLanguage', language);
    console.log('Learning language set to', language);
}

function navigateTo(page) {
    console.log('Navigating to', page);
    fetch(page)
        .then(response => response.text())
        .then(html => {
            document.open();
            document.write(html);
            document.close();
            history.pushState(null, '', page);
        });
}

window.onpopstate = function() {
    navigateTo(location.pathname);
};