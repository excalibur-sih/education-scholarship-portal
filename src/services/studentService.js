const API_URL = "http://localhost:5000/api/students";

// Get all students
export async function getStudents() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch students");
    }

    return response.json();
}

// Add a new student
export async function addStudent(student) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
    });

    if (!response.ok) {
        throw new Error("Failed to add student");
    }

    return response.json();
}

// Update an existing student
export async function updateStudent(studentId, student) {
    const response = await fetch(`${API_URL}/${studentId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
    });

    if (!response.ok) {
        throw new Error("Failed to update student");
    }

    return response.json();
}