window.addEventListener("DOMContentLoaded", getData);

async function getData(){
    let response = await fetch("students1991.json");
    students = await response.json();
    showStudents();
}

function showStudents() {
    let studentTemplate = document.querySelector(".templates");
    let dataList = document.querySelector("#dataList");

    dataList.innerHTML = "";

    students.forEach(student => {
        const clone = studentTemplate.cloneNode(true).content;
        clone.querySelector(".house").textContent = student.house;
        clone.querySelector(".name").textContent = student.fullname;
        dataList.appendChild(clone);
    })

    let items = document.querySelectorAll(".listItem");
    items.forEach(item => {
        item.addEventListener("click", popup);
    })
}

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var content = document.getElementsByClassName("modal-content")[0];

function popup(){
    const clone = this.cloneNode(true);
    const houseName = clone.querySelector(".house").textContent;
    content.dataset.house = houseName;
    document.querySelector("#myModal > div > img").src = "img/" + houseName + ".svg";
    document.querySelector("#myModal > div > img").alt = houseName + "-crest";
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