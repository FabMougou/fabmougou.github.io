import info from './info.js';
const loginCodes = ['3596', 'DurAdmin', 'demo'];
var admin = false;

function Login() {
    const code = document.getElementById('codeInput').value;
    const errorMsg = document.getElementById('errorMsg');
    console.log("Submitted code:", code); // Perform any action with the code

    if (code == 'DurAdmin') {
        admin = true;
    }

    if (loginCodes.includes(code)) {
        displayInfo(code);
        document.getElementById('login-container').style.display = 'none';
    } else {
        errorMsg.innerText = "Please enter a valid code.";
        errorMsg.style.display = "block";
    }
}

function displayInfo(code){
    const currentDate = new Date();
    const container = document.getElementById('main');
    let html = '';

    if (admin) {
        html += `
        <div class="admin-container">
            Logged in as admin
        </div>
        `;
    }

    for (let student of info.students) {
        if (student.code !== code && !admin) {
            console.log('AKIPPED')
            continue;
        }

        let studentHtml = `
        <div class="scrolling-container">
            <span class="student">${student.name}</span>
            <div>
                <span class="hours-tally">Total Hours: ${student.hours_total}</span>
                <span class="hours-tally">Hours left: ${student.hours_left}</span>
            </div>
            <div class="row flex-nowrap overflow-auto">
        `;

        for (let session of student.sessions) {
            const [day, month, year] = session.date.split('.');
            const sessionDate = new Date(`20${year}-${month}-${day}`);
            const sessionBoxClass = sessionDate < currentDate ? 'session-box-done' : 'session-box-todo';

            let sessionHtml = `
            <div class="col-2 ${sessionBoxClass}">
                <span class="date">${session.date}</span><br>
                <span class="time">${session.time}</span><br>
                <span class="hours">Hours: ${session.hours}</span><br>
                <span class="topic">${session.subject}</span>
            </div>
            `;
            studentHtml += sessionHtml;
        }
        studentHtml += `</div></div>`;
        html += studentHtml;
    }
    container.innerHTML = html;
}

document.getElementById('loginButton').addEventListener('click', Login);