// DOM elements
const form = document.getElementById('studentForm');
const studentsBody = document.getElementById('studentsBody');

// Event listener for form submission
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const course = document.getElementById('course').value;
    const rollno = document.getElementById('rollno').value;

    try {
        // Add student via POST request
        const response = await axios.post('http://localhost:3000/students', {
            name,
            course,
            rollno
        });
        
        const newStudent = response.data;
        appendStudentRow(newStudent);
        form.reset();
    } catch (error) {
        console.error('Error adding student:', error);
    }
});

// Fetch all students from server on page load
async function fetchStudents() {
    try {
        const response = await axios.get('http://localhost:3000/students');
        const students = response.data;
        studentsBody.innerHTML = ''; // Clear existing table rows
        students.forEach(student => appendStudentRow(student));
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

// Function to append row to the table
function appendStudentRow(student) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.course}</td>
        <td>${student.rollno}</td>
        <td>
            <button class="btn btn-primary btn-sm mr-2" onclick="handleEdit('${student.id}', '${student.name}', '${student.course}', '${student.rollno}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="handleDelete('${student.id}')">Delete</button>
        </td>
    `;
    studentsBody.appendChild(row);
}

// Edit student details
async function editStudent(id, name, course, rollno) {
    try {
        const response = await axios.put(`http://localhost:3000/students/${id}`, {
            name,
            course,
            rollno
        });

        const updatedStudent = response.data;
        console.log('Student updated:', updatedStudent);

        fetchStudents(); // Refresh student list
    } catch (error) {
        console.error('Error updating student:', error);
    }
}

// Handle edit button click
function handleEdit(id, name, course, rollno) {
    const newName = prompt('Enter new name:', name);
    const newCourse = prompt('Enter new course:', course);
    const newRollno = prompt('Enter new roll no:', rollno);

    if (newName !== null && newCourse !== null && newRollno !== null) {
        editStudent(id, newName, newCourse, newRollno);
    }
}

// Delete student
async function deleteStudent(id) {
    try {
        await axios.delete(`http://localhost:3000/students/${id}`);
        fetchStudents(); // Refresh student list
    } catch (error) {
        console.error('Error deleting student:', error);
    }
}

// Handle delete button click
function handleDelete(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        deleteStudent(id);
    }
}

// Initial fetch of students
fetchStudents();
