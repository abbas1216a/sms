let students = JSON.parse(localStorage.getItem('students')) || [];
let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
let courses = JSON.parse(localStorage.getItem('courses')) || [];
let results = JSON.parse(localStorage.getItem('results')) || [];
let admissions = JSON.parse(localStorage.getItem('admissions')) || [];
let editingResultIndex = -1;

function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

function saveTeachers() {
    localStorage.setItem('teachers', JSON.stringify(teachers));
}

function saveCourses() {
    localStorage.setItem('courses', JSON.stringify(courses));
}

function saveResults() {
    localStorage.setItem('results', JSON.stringify(results));
}

function saveAdmissions() {
    localStorage.setItem('admissions', JSON.stringify(admissions));
}

function renderStudents() {
    const body = document.getElementById('studentTable');
    body.innerHTML = '';
    students.forEach((student, index) => {
        body.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.studentClass || 'N/A'}</td>
            <td>${student.admissionDate || 'N/A'}</td>
            <td>${student.email}</td>
            <td>
                <button class="edit" onclick="editStudent(${index})">Edit</button>
                <button class="delete" onclick="deleteStudent(${index})">Delete</button>
            </td>
        </tr>
        `;
    });
}

function renderAdmissions() {
    const body = document.getElementById('admissionTable');
    body.innerHTML = '';
    admissions.forEach((admission, index) => {
        body.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${admission.studentName}</td>
            <td>${admission.studentClass}</td>
            <td>${admission.course}</td>
            <td>${admission.email}</td>
            <td>${admission.admissionDate}</td>
            <td>
                <button class="delete" onclick="deleteAdmission(${index})">Delete</button>
            </td>
        </tr>
        `;
    });
}

function renderTeachers() {

    const body = document.getElementById('teacherTable');
    body.innerHTML = '';
    teachers.forEach((teacher, index) => {
        body.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${teacher.name}</td>
            <td>${teacher.subject}</td>
            <td>${teacher.email}</td>
            <td>
                <button class="edit" onclick="editTeacher(${index})">Edit</button>
                <button class="delete" onclick="deleteTeacher(${index})">Delete</button>
            </td>
        </tr>
        `;
    });
}

function renderCourses() {
    const body = document.getElementById('courseTable');
    body.innerHTML = '';
    courses.forEach((course, index) => {
        body.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${course.name}</td>
            <td>${course.description}</td>
            <td>
                <button class="edit" onclick="editCourse(${index})">Edit</button>
                <button class="delete" onclick="deleteCourse(${index})">Delete</button>
            </td>
        </tr>
        `;
    });
}

function renderResults() {
    const body = document.getElementById('resultTable');
    body.innerHTML = '';
    results.forEach((result, index) => {
        const status = result.score >= 50 ? 'Pass' : 'Fail';
        body.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${result.student}</td>
            <td>${result.resultClass || 'N/A'}</td>
            <td>${result.course}</td>
            <td>${result.score}</td>
            <td>${status}</td>
            <td>
                <button class="edit" onclick="editResult(${index})">Edit</button>
                <button class="delete" onclick="deleteResult(${index})">Delete</button>
            </td>
        </tr>
        `;
    });
}

function resetResultForm() {
    document.getElementById('resultStudent').value = '';
    document.getElementById('resultClass').value = '';
    document.getElementById('resultCourse').value = '';
    document.getElementById('resultScore').value = '';
    const btn = document.getElementById('resultSubmitBtn');
    if (btn) {
        btn.innerText = 'Add Result';
        btn.setAttribute('onclick', 'addResult()');
    }
    editingResultIndex = -1;
}

function addStudent() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const studentClass = document.querySelector('input[name="studentClass"]:checked')?.value;
    const admissionDate = normalizeDate(document.getElementById('admissionDate').value);

    if (!name || !email || !studentClass || !admissionDate) {
        alert('Please fill all fields and select a class');
        return;
    }

    students.push({ name, email, studentClass, admissionDate });
    saveStudents();
    
    admissions.push({ studentName: name, studentClass, course: '', email, admissionDate });
    saveAdmissions();
    
    renderStudents();
    renderAdmissions();
    updateDashboardCounters();
    updateAdmissionCalendar(admissionDate);
    renderStats();
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
        document.getElementById('admissionDate').value = '';
    document.querySelector('input[name="studentClass"]:checked').checked = false;
}

function deleteStudent(index) {
    if (confirm('Delete Student?')) {
        students.splice(index, 1);
        saveStudents();
        renderStudents();
        updateDashboardCounters();
    }
}

function editStudent(index) {
    const newName = prompt('Edit Student Name', students[index].name);
    const newClass = prompt('Edit Class', students[index].studentClass || '');
    const newEmail = prompt('Edit Email', students[index].email);
    const newAdmission = prompt('Edit Admission Date (YYYY-MM-DD)', students[index].admissionDate || '');

    if (newName && newEmail && newClass && newAdmission) {
        students[index] = { name: newName, studentClass: newClass, email: newEmail, admissionDate: normalizeDate(newAdmission) };
        saveStudents();
        renderStudents();
        renderAdmissions();
        renderStats();
    }
}

function addTeacher() {
    const name = document.getElementById('teacherName').value.trim();
    const subject = document.getElementById('teacherSubject').value.trim();
    const email = document.getElementById('teacherEmail').value.trim();

    if (!name || !subject || !email) {
        alert('Please fill all teacher fields');
        return;
    }

    teachers.push({ name, subject, email });
    saveTeachers();
    renderTeachers();
    document.getElementById('teacherName').value = '';
    document.getElementById('teacherSubject').value = '';
    document.getElementById('teacherEmail').value = '';
    updateDashboardCounters();
}

function deleteTeacher(index) {
    if (confirm('Delete Teacher?')) {
        teachers.splice(index, 1);
        saveTeachers();
        renderTeachers();
        updateDashboardCounters();
    }
}

function editTeacher(index) {
    const newName = prompt('Edit Teacher Name', teachers[index].name);
    const newSubject = prompt('Edit Subject', teachers[index].subject);
    const newEmail = prompt('Edit Email', teachers[index].email);

    if (newName && newSubject && newEmail) {
        teachers[index] = { name: newName, subject: newSubject, email: newEmail };
        saveTeachers();
        renderTeachers();
    }
}

function addCourse() {
    const name = document.getElementById('courseName').value.trim();
    const description = document.getElementById('courseDescription').value.trim();

    if (!name || !description) {
        alert('Please fill all course fields');
        return;
    }

    courses.push({ name, description });
    saveCourses();
    renderCourses();
    document.getElementById('courseName').value = '';
    document.getElementById('courseDescription').value = '';
    updateDashboardCounters();
}

function addResult() {
    const student = document.getElementById('resultStudent').value.trim();
    const resultClass = document.getElementById('resultClass').value.trim();
    const course = document.getElementById('resultCourse').value.trim();
    const score = parseInt(document.getElementById('resultScore').value, 10);

    if (!student || !resultClass || !course || Number.isNaN(score)) {
        alert('Please fill all result fields including class selection');
        return;
    }

    results.push({ student, resultClass, course, score });
    saveResults();
    renderResults();
    renderStats();
    updateDashboardCounters();
    document.getElementById('resultStudent').value = '';
    document.getElementById('resultClass').value = '';
    document.getElementById('resultCourse').value = '';
    document.getElementById('resultScore').value = '';
}

function deleteCourse(index) {
    if (confirm('Delete Course?')) {
        courses.splice(index, 1);
        saveCourses();
        renderCourses();
        updateDashboardCounters();
    }
}

function deleteAdmission(index) {
    if (confirm('Delete Admission Record?')) {
        admissions.splice(index, 1);
        saveAdmissions();
        renderAdmissions();
    }
}

function deleteResult(index) {

    if (confirm('Delete Result?')) {
        results.splice(index, 1);
        // adjust editing index if needed
        if (editingResultIndex === index) {
            resetResultForm();
        } else if (editingResultIndex > index) {
            editingResultIndex--;
        }
        saveResults();
        renderResults();
        renderStats();
        updateDashboardCounters();
    }
}

function editCourse(index) {
    const newName = prompt('Edit Course Name', courses[index].name);
    const newDescription = prompt('Edit Description', courses[index].description);

    if (newName && newDescription) {
        courses[index] = { name: newName, description: newDescription };
        saveCourses();
        renderCourses();
    }
}

function editResult(index) {
    // populate the result form for in-place editing
    const r = results[index];
    if (!r) return;
    document.getElementById('resultStudent').value = r.student || '';
    document.getElementById('resultClass').value = r.resultClass || '';
    document.getElementById('resultCourse').value = r.course || '';
    document.getElementById('resultScore').value = r.score || '';
    const btn = document.getElementById('resultSubmitBtn');
    if (btn) {
        btn.innerText = 'Update Result';
        btn.setAttribute('onclick', 'updateResult()');
    }
    showSection('papersSection');
    editingResultIndex = index;
}

function updateResult() {
    if (editingResultIndex < 0 || editingResultIndex >= results.length) return;
    const student = document.getElementById('resultStudent').value.trim();
    const resultClass = document.getElementById('resultClass').value.trim();
    const course = document.getElementById('resultCourse').value.trim();
    const score = parseInt(document.getElementById('resultScore').value, 10);

    if (!student || !resultClass || !course || Number.isNaN(score)) {
        alert('Please fill all result fields including class selection');
        return;
    }

    results[editingResultIndex] = { student, resultClass, course, score };
    saveResults();
    renderResults();
    renderStats();
    updateDashboardCounters();
    resetResultForm();
}

function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerHTML = now.toLocaleTimeString();
    document.getElementById('today').innerHTML = now.toDateString();
}

function getTodayLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function normalizeDate(value) {
    if (!value) return getTodayLocalDate();
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return getTodayLocalDate();
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getAdmissionsByDate(date) {
    const normalized = normalizeDate(date);
    return students.filter(student => student.admissionDate === normalized);
}

function updateAdmissionCalendar(date) {
    const admissions = getAdmissionsByDate(date);
    const list = document.getElementById('admissionList');
    const label = document.getElementById('todayAdmissions');
    label.innerText = `${admissions.length} students`;
    list.innerHTML = admissions.length
    ? admissions.map(student => `<li>${student.name} (${student.studentClass || 'N/A'})</li>`).join('')
        : '<li>No admissions</li>';
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Student List', 20, 20);
    let y = 40;
    students.forEach((s, i) => {
        doc.text(`${i + 1}. ${s.name} | ${s.studentClass || 'N/A'} | ${s.admissionDate || ''} | ${s.email}`, 20, y);
        y += 10;
    });
    doc.save('Students.pdf');
}

function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'Students.xlsx');
}

function logout() {
    window.location = 'index.html';
}

function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.toggle('active', section.id === sectionId);
    });

    const titleMap = {
        dashboardSection: 'Student Dashboard',
        studentsSection: 'Students',
        teachersSection: 'Teachers',
        coursesSection: 'Courses',
        admissionsSection: 'Admissions',
        papersSection: 'Papers',
        statisticsSection: 'Statistics',
        settingsSection: 'Settings'
    };
    document.getElementById('pageTitle').innerText = titleMap[sectionId] || 'Student Dashboard';

    const searchBar = document.getElementById('search');
    const searchDisplay = ['studentsSection', 'teachersSection', 'coursesSection'].includes(sectionId) ? 'block' : 'none';
    if (searchBar) searchBar.parentElement.style.display = searchDisplay;
    
    if (searchBar && searchDisplay === 'block') {
        const placeholders = {
            studentsSection: 'Search students...',
            teachersSection: 'Search teachers...',
            coursesSection: 'Search courses...'
        };
        searchBar.placeholder = placeholders[sectionId] || 'Search...';
        searchBar.value = '';
    }
}

function initDashboard() {
    renderStudents();
    renderTeachers();
    renderCourses();
    renderResults();
    renderAdmissions();
    updateClock();
    setInterval(updateClock, 1000);

    const calendar = document.getElementById('calendarDate');
    if (calendar) {
        const today = getTodayLocalDate();
        calendar.value = today;
        calendar.addEventListener('change', function () {
            updateAdmissionCalendar(this.value);
        });
        updateAdmissionCalendar(today);
    }

    const search = document.getElementById('search');
    if (search) {
        search.addEventListener('keyup', function () {
            const filter = this.value.toLowerCase();
            const activeSection = document.querySelector('.page-section.active');
            
            if (activeSection.id === 'studentsSection') {
                document.querySelectorAll('#studentTable tr').forEach(row => {
                    row.style.display = row.innerText.toLowerCase().includes(filter) ? '' : 'none';
                });
            } else if (activeSection.id === 'teachersSection') {
                document.querySelectorAll('#teacherTable tr').forEach(row => {
                    row.style.display = row.innerText.toLowerCase().includes(filter) ? '' : 'none';
                });
            } else if (activeSection.id === 'coursesSection') {
                document.querySelectorAll('#courseTable tr').forEach(row => {
                    row.style.display = row.innerText.toLowerCase().includes(filter) ? '' : 'none';
                });
            }
        });
    }

    updateDashboardCounters();

    document.querySelectorAll('.counter').forEach(counter => {
        const isRevenue = counter.id === 'revenueCount';
        counter.innerHTML = isRevenue ? '$0' : '0';
        const update = () => {
            const target = +counter.dataset.target;
            const current = isRevenue ? parseInt(counter.innerHTML.replace(/[^0-9]/g, ''), 10) || 0 : +counter.innerHTML;
            const increment = Math.max(1, Math.ceil(target / 80));
            if (current < target) {
                const nextValue = Math.min(target, current + increment);
                counter.innerHTML = isRevenue ? `$${nextValue}` : nextValue;
                setTimeout(update, 20);
            } else {
                counter.innerHTML = isRevenue ? `$${target}` : target;
            }
        };
        update();
    });

    const ctx = document.getElementById('myChart');
    if (ctx) {
        const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        // compute monthly counts from students' admissionDate
        const monthlyCounts = new Array(12).fill(0);
        students.forEach(s => {
            if (!s.admissionDate) return;
            const d = new Date(s.admissionDate);
            if (!Number.isNaN(d.getTime())) {
                monthlyCounts[d.getMonth()] += 1;
            }
        });
        window.enrollmentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: monthLabels,
                datasets: [{
                    label: 'Students',
                    data: monthlyCounts,
                    borderWidth: 1,
                    backgroundColor: '#4f46e5'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    const statsCtx = document.getElementById('statsChart');
    if (statsCtx) {
        window.statsChart = new Chart(statsCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Enrollment',
                    data: [],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79,70,229,0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
        renderStats();
    }

    document.getElementById('darkBtn').onclick = function () {
        document.body.classList.toggle('dark');
    };

    showSection('dashboardSection');
}

function renderStats() {
    const revenue = students.length * 5;
    const studentCount = students.length;
    const courseCount = courses.length;
    const resultCount = results.length;

    document.getElementById('quickStudents').innerText = `Total Students: ${studentCount}`;
    document.getElementById('quickCourses').innerText = `Total Courses: ${courseCount}`;
    document.getElementById('quickResults').innerText = `Total Results: ${resultCount}`;
    document.getElementById('quickRevenue').innerText = `Monthly Revenue: $${revenue}`;

    if (window.statsChart) {
        const labels = [];
        const counts = [];
        const admissionsByDate = {};

        students.forEach(s => {
            admissionsByDate[s.admissionDate] = (admissionsByDate[s.admissionDate] || 0) + 1;
        });

        Object.keys(admissionsByDate).sort().forEach(date => {
            labels.push(date);
            counts.push(admissionsByDate[date]);
        });

        window.statsChart.data.labels = labels.length ? labels : ['No data'];
        window.statsChart.data.datasets[0].data = counts.length ? counts : [0];
        window.statsChart.update();
    }

    // update monthly enrollment bar chart if present
    if (window.enrollmentChart) {
        const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const monthlyCounts = new Array(12).fill(0);
        students.forEach(s => {
            if (!s.admissionDate) return;
            const d = new Date(s.admissionDate);
            if (!Number.isNaN(d.getTime())) monthlyCounts[d.getMonth()] += 1;
        });
        window.enrollmentChart.data.labels = monthLabels;
        window.enrollmentChart.data.datasets[0].data = monthlyCounts;
        window.enrollmentChart.update();
    }
}

function updateDashboardCounters() {
    const revenue = students.length * 5;
    document.getElementById('studentCount').dataset.target = students.length;
    document.getElementById('teacherCount').dataset.target = teachers.length;
    document.getElementById('courseCount').dataset.target = courses.length;
    document.getElementById('resultCount').dataset.target = results.length;
    document.getElementById('revenueCount').dataset.target = revenue;

    document.getElementById('studentCount').innerText = students.length;
    document.getElementById('teacherCount').innerText = teachers.length;
    document.getElementById('courseCount').innerText = courses.length;
    document.getElementById('resultCount').innerText = results.length;
    document.getElementById('revenueCount').innerText = `$${revenue}`;
}

window.onload = initDashboard;
