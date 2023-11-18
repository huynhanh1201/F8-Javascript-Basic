var students = "http://localhost:3000/students";

// Functions

// Create student
createStudent = (data) => {
    var option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    fetch(students, option)
        .then((response) => response.json())
        .then((response) => console.log(response));
};

// Render students
renderStudents = (students) => {
    var blockList = document.querySelector(".block-list");

    var html = students.map((student) => {
        return `
        <li>
            <p><b>Name: </b>${student.name}</p>
            <p><b>Point: </b>${student.point}</p>
        </li>
        <hr>
        `;
    });

    blockList.innerHTML = html.join("");
};

// Get students
getStudents = (callBack) => {
    fetch(students)
        .then((response) => response.json())
        .then(callBack);
};

start = () => {
    getStudents(renderStudents);
};
// =========================================
start();

createStudent();
