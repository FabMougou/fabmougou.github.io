import info from './info.js';
console.log(info);

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
        let sessionHtml = `
        <div class="col-2 session-box">
            <span class="date">${session.date}</span>
            <span class="hours">Hours: ${session.hours}</span>
            <span class="topic">Computer Science</span>
        </div>
        `;
        studentHtml += sessionHtml;
    }
    studentHtml += `</div></div>`;
    html += studentHtml;
}


container.innerHTML = html;