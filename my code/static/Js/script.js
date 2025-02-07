// Replace localStorage operations with API calls

const API_BASE = 'http://localhost:5000/api';

async function fetchTasks(userId) {
    const response = await fetch(`${API_BASE}/tasks?user_id=${userId}`);
    return await response.json();
}

async function saveTask(task, userId) {
    const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...task, user_id: userId})
    });
    return await response.json();
}

async function deleteTask(taskId) {
    const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE'
    });
    return await response.json();
}

// Modify the saveData function
const saveData = async () => {
    const taskDescription = textInput.value;
    const dueDate = dateInput.value;

    if (taskDescription.trim() === "" || dueDate === "") {
        swal({ title: "Error", text: "Please enter both task and due date!", icon: "error" });
        return;
    }

    try {
        const task = {
            text: taskDescription,
            date: dueDate,
            completed: false
        };

        await saveTask(task, currentUser.id);
        textInput.value = "";
        dateInput.value = "";
        displayTasks(currentSection);
    } catch (error) {
        swal({ title: "Error", text: "Failed to save task", icon: "error" });
    }
};

// Update the displayTasks function
const displayTasks = async (section) => {
    try {
        const tasks = await fetchTasks(currentUser.id);
        // Rest of the existing display logic...
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
};

// Add user authentication logic
let currentUser = null;

async function handleLogin(email, password) {
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            currentUser = await response.json();
            displayProfileData();
            displayTasks(currentSection);
        } else {
            swal({ title: "Error", text: "Invalid credentials", icon: "error" });
        }
    } catch (error) {
        console.error('Login error:', error);
    }
}

// Modify the logout function
logoutLink.addEventListener("click", () => {
    swal({ /* ... */ }).then((willLogout) => {
        if (willLogout) {
            currentUser = null;
            window.location.reload();
        }
    });
});