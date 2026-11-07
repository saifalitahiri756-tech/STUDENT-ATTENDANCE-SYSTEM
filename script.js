
let students = JSON.parse(localStorage.getItem("students")) || [];

let records = JSON.parse(localStorage.getItem("records")) || {};

let attendance = {};

const dateInput = document.getElementById("attendanceDate");

dateInput.value = new Date().toLocaleDateString("en-CA");

function loadAttendance() {
    const date = dateInput.value;

    attendance = records[date]
        ? { ...records[date] }
        : {};

    students.forEach(student => {
        if (!attendance[student.id]) {
            attendance[student.id] = "Absent";
        }
    });

    displayStudents();
    updateDashboard();
}

function addStudent() {
    const name = document.getElementById("studentName").value.trim();

    const roll = document.getElementById("rollNumber").value.trim();

    if (name === "" || roll === "") {
        alert("Please enter student name and roll number.");
        return;
    }

    if (students.some(s => s.roll.toLowerCase() === roll.toLowerCase())) {
        alert("This roll number already exists.");
        return;
    }

    const student = {
        id: Date.now().toString() + Math.random(),
        name: name,
        roll: roll
    };

    students.push(student);

    localStorage.setItem("students", JSON.stringify(students));

    document.getElementById("studentName").value = "";
    document.getElementById("rollNumber").value = "";

    loadAttendance();
}

function displayStudents() {
    const list = document.getElementById("studentList");

    list.innerHTML = "";

    students.forEach(student => {
        const status = attendance[student.id] || "Absent";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.roll}</td>
            <td></td>
            <td>
                <select class="status-select"
                    onchange="changeStatus('${student.id}', this.value)">
                    <option value="Present" ${status === "Present" ? "selected" : ""}>Present</option>
                    <option value="Absent" ${status === "Absent" ? "selected" : ""}>Absent</option>
                </select>
            </td>
            <td>
                <button class="delete-btn"
                    onclick="deleteStudent('${student.id}')">
                    Delete
                </button>
            </td>
        `;

        row.children[1].textContent = student.name;

        list.appendChild(row);
    });
}

function changeStatus(id, status) {
    attendance[id] = status;
    updateDashboard();
}

function markAll(status) {
    students.forEach(student => {
        attendance[student.id] = status;
    });

    displayStudents();
    updateDashboard();
}

function updateDashboard() {
    const total = students.length;

    const present = students.filter(student =>
        attendance[student.id] === "Present"
    ).length;

    const absent = total - present;

    const percentage = total === 0
        ? 0
        : Math.round((present / total) * 100);

    document.getElementById("total").textContent = total;
    document.getElementById("present").textContent = present;
    document.getElementById("absent").textContent = absent;
    document.getElementById("percentage").textContent = percentage + "%";
}

function saveAttendance() {
    const date = dateInput.value;

    if (!date) {
        alert("Please select a date.");
        return;
    }

    records[date] = { ...attendance };

    localStorage.setItem("records", JSON.stringify(records));

    alert("Attendance saved successfully!");

    showHistory();
}

function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    students = students.filter(student => student.id !== id);

    Object.values(records).forEach(record => {
        delete record[id];
    });

    delete attendance[id];

    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("records", JSON.stringify(records));

    loadAttendance();
}

function showHistory() {
    const history = document.getElementById("history");

    const dates = Object.keys(records).sort().reverse();

    if (dates.length === 0) {
        history.textContent = "No attendance records saved yet.";
        return;
    }

    history.innerHTML = "";

    dates.forEach(date => {
        const saved = records[date];

        const present = Object.values(saved).filter(
            status => status === "Present"
        ).length;

        const absent = Object.values(saved).filter(
            status => status === "Absent"
        ).length;

        const total = present + absent;

        const item = document.createElement("p");

        item.textContent =
            date + " — Present: " + present +
            ", Absent: " + absent +
            ", Total: " + total;

        history.appendChild(item);
    });
}

dateInput.addEventListener("change", loadAttendance);

loadAttendance();
showHistory();

