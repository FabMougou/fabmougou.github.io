import info from './info.js';

function Login() {
    const code = document.getElementById('codeInput').value;
    const errorMsg = document.getElementById('errorMsg');
    console.log("Submitted code:", code); // Perform any action with the code
    if (code === '1234') {
        displayInfo();
        document.getElementById('login-container').style.display = 'none';
    } else {
        errorMsg.innerText = "Please enter a valid code.";
        errorMsg.style.display = "block";
    }
}




function displayInfo(){
    const currentDate = new Date();
    const container = document.getElementById('main');
    let html = '';

    for (let student of info.students) {
        let studentHtml = `
        <div class="scrolling-container m-4">
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
                <span class="topic">Computer Science</span>
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