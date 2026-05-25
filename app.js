// LOGIN

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(e) {

        e.preventDefault();

        const username = document.getElementById("username").value;

        localStorage.setItem("studentUser", username);

        window.location.href = "dashboard.html";
    });
}

// LOGOUT

function logout() {

    localStorage.removeItem("studentUser");

    window.location.href = "index.html";
}

// ASSIGNMENTS STORAGE

let assignments = JSON.parse(localStorage.getItem("assignments")) || [];

// ADD ASSIGNMENT

const assignmentForm = document.getElementById("assignmentForm");

if (assignmentForm) {

    assignmentForm.addEventListener("submit", function(e) {

        e.preventDefault();

        const title = document.getElementById("title").value;
        const module = document.getElementById("module").value;
        const dueDate = document.getElementById("dueDate").value;
        const priority = document.getElementById("priority").value;
        const description = document.getElementById("description").value;

        const assignment = {
            id: Date.now(),
            title,
            module,
            dueDate,
            priority,
            description,
            completed: false
        };

        assignments.push(assignment);

        localStorage.setItem("assignments", JSON.stringify(assignments));

        assignmentForm.reset();

        renderAssignments();

        updateStats();

        alert("Assignment added successfully!");
        showToast(
    "Assignment added successfully!",
    "success"
);
    });
}

// RENDER ASSIGNMENTS

function renderAssignments() {

    const container = document.getElementById("assignmentsContainer");

    if (!container) return;

    container.innerHTML = "";

    // GET SEARCH VALUE
    const searchValue =
        document.getElementById("searchInput")?.value.toLowerCase() || "";

    // GET FILTER VALUE
    const priorityValue =
        document.getElementById("filterPriority")?.value || "All";

    // FILTER ASSIGNMENTS
    const filteredAssignments = assignments.filter(assignment => {

        // SEARCH MATCH
        const matchesSearch =
            assignment.title.toLowerCase().includes(searchValue) ||
            assignment.module.toLowerCase().includes(searchValue);

        // PRIORITY MATCH
        const matchesPriority =
            priorityValue === "All" ||
            assignment.priority === priorityValue;

        // ONLY SHOW NON-COMPLETED
        return matchesSearch &&
               matchesPriority &&
               !assignment.completed;
    });

    // DISPLAY FILTERED ASSIGNMENTS
    filteredAssignments.forEach(assignment => {

        const due = new Date(assignment.dueDate);
        const today = new Date();

        let statusColor = "#F59E0B";

        if (due < today) {
            statusColor = "#DC2626";
        }

        const div = document.createElement("div");

        div.classList.add("assignment-item");

        div.innerHTML = `
            <h3>${assignment.title}</h3>

            <p><strong>Module:</strong> ${assignment.module}</p>

            <p><strong>Due Date:</strong> ${assignment.dueDate}</p>

            <p><strong>Priority:</strong> ${assignment.priority}</p>

            <p>${assignment.description}</p>

            <div class="assignment-actions">

                <button 
                    class="complete-btn"
                    onclick="completeAssignment(${assignment.id})"
                >
                    Complete
                </button>

                <button 
                    class="delete-btn"
                    onclick="deleteAssignment(${assignment.id})"
                >
                    Delete
                </button>

            </div>
        `;

        div.style.borderLeft = `6px solid ${statusColor}`;

        container.appendChild(div);
    });
}

// COMPLETE ASSIGNMENT

function completeAssignment(id) {

    assignments = assignments.map(assignment => {

        if (assignment.id === id) {
            assignment.completed = true;
        }

        return assignment;
    });

    localStorage.setItem("assignments", JSON.stringify(assignments));

    renderAssignments();

    renderCompletedAssignments();

    updateStats();
    showToast(
    "Assignment marked as completed!",
    "success"
);
}

// DELETE ASSIGNMENT

function deleteAssignment(id) {

    const confirmDelete = confirm("Are you sure you want to delete this assignment?");

    if (confirmDelete) {

        assignments = assignments.filter(assignment => assignment.id !== id);

        localStorage.setItem("assignments", JSON.stringify(assignments));

        renderAssignments();

        updateStats();
    }
}

// COMPLETED PAGE

function renderCompletedAssignments() {

    const container = document.getElementById("completedContainer");

    if (!container) return;

    container.innerHTML = "";

    assignments.forEach(assignment => {

        if (assignment.completed) {

            const div = document.createElement("div");

            div.classList.add("assignment-item");

            div.innerHTML = `
                <h3>${assignment.title}</h3>
                <p><strong>Module:</strong> ${assignment.module}</p>
                <p><strong>Completed</strong></p>
            `;

            div.style.borderLeft = "6px solid #16A34A";

            container.appendChild(div);
        }
    });
}

// UPDATE STATS

function updateStats() {

    const total = assignments.length;

    const completed = assignments.filter(a => a.completed).length;

    const overdue = assignments.filter(a => {

        return new Date(a.dueDate) < new Date() && !a.completed;

    }).length;

    const upcoming = assignments.filter(a => {

        return new Date(a.dueDate) >= new Date() && !a.completed;

    }).length;

    const totalElement = document.getElementById("totalAssignments");
    const completedElement = document.getElementById("completedAssignments");
    const overdueElement = document.getElementById("overdueAssignments");
    const upcomingElement = document.getElementById("upcomingAssignments");

    if (totalElement) totalElement.textContent = total;
    if (completedElement) completedElement.textContent = completed;
    if (overdueElement) overdueElement.textContent = overdue;
    if (upcomingElement) upcomingElement.textContent = upcoming;
}

// SEARCH FILTER

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keyup", function() {

        const value = searchInput.value.toLowerCase();

        const items = document.querySelectorAll(".assignment-item");

        items.forEach(item => {

            item.style.display =
                item.textContent.toLowerCase().includes(value)
                ? "block"
                : "none";
        });
    });
}

// INITIALIZE

renderAssignments();

renderCompletedAssignments();

updateStats();

// CALENDAR VIEW

document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth'
  });

  calendar.render();
});

// SEARCH BUTTON

const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {

    searchBtn.addEventListener("click", () => {

        renderAssignments();

    });
}

// PRIORITY FILTER

const filterPriority = document.getElementById("filterPriority");

if (filterPriority) {

    filterPriority.addEventListener("change", () => {

        renderAssignments();

    });
}

searchBtn.innerText = "Searching...";

// POPUP TOAST NOTIFICATIONS

function showToast(message, type = "info") {

    const toastContainer =
        document.getElementById("toastContainer");

    if (!toastContainer) return;

    // CREATE TOAST

    const toast =
        document.createElement("div");

    toast.classList.add("toast", type);

    toast.innerHTML = `

        <span>${message}</span>

        <button onclick="this.parentElement.remove()">

            ✕

        </button>

    `;

    // ADD TO PAGE

    toastContainer.appendChild(toast);

    // AUTO REMOVE

    setTimeout(() => {

        toast.remove();

    }, 4000);
}

function checkDeadlines() {

    const today = new Date();

    assignments.forEach(assignment => {

        if (!assignment.completed) {

            const dueDate =
                new Date(assignment.dueDate);

            const difference =
                Math.ceil(
                    (dueDate - today) /
                    (1000 * 60 * 60 * 24)
                );

            // DUE SOON

            if (difference <= 2 && difference >= 0) {

                showToast(

                    `${assignment.title} is due in ${difference} day(s)!`,

                    "warning"
                );
            }

            // OVERDUE

            if (difference < 0) {

                showToast(

                    `${assignment.title} is overdue!`,

                    "error"
                );
            }
        }
    });
}

checkDeadlines();