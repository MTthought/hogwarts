"use strict";
window.addEventListener("DOMContentLoaded", getData);

async function getData(){
    const response = await fetch("students1991.json");
    const students = await response.json();
    showStudents(students);
}

function showStudents(students) {
    const studentTemplate = document.querySelector(".templates");
    const dataList = document.querySelector("#dataList");

    dataList.innerHTML = "";

    students.forEach(student => {
        const clone = studentTemplate.cloneNode(true).content;
        clone.querySelector(".house").textContent = student.house;
        clone.querySelector(".name").textContent = student.fullname;
        dataList.appendChild(clone);
    })

    const items = document.querySelectorAll(".listItem");
    items.forEach(item => {
        item.addEventListener("click", popup);
    })
}

const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const modalInner = document.getElementsByClassName("modal-content")[0];
const content = document.getElementById("student-content");

function popup(){
    const clone = this.cloneNode(true);
    const houseName = clone.querySelector(".house").textContent;
    modalInner.dataset.house = houseName;
    document.querySelector("#student-content > img").src = "img/" + houseName + ".svg";
    document.querySelector("#student-content > img").alt = houseName + "-crest";
    content.appendChild(clone);
    modal.style.display = "block";
}

span.onclick = function() {
    content.removeChild(content.lastChild);
    modal.style.display = "none";
  }
  
window.onclick = function(event) {
if (event.target == modal) {
    content.removeChild(content.lastChild);
    modal.style.display = "none";
}
}