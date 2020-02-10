window.addEventListener("DOMContentLoaded", start);

let theme1btn = document.querySelector("#theme1");
let theme2btn = document.querySelector("#theme2");
let stylelem = document.documentElement.style;

function start(){
    theme1btn.addEventListener("click", theme1)
    theme2btn.addEventListener("click", theme2)
    getData();
}

function theme1(){
    theme2btn.classList.remove("active");
    theme1btn.classList.add("active");
    setTheme();
}

function theme2(){
    theme1btn.classList.remove("active");
    theme2btn.classList.add("active");
    setTheme();
}

function setTheme(){
    const theme2active = theme2btn.classList.contains("active");
    if(theme2active == true){
        stylelem.setProperty('--user-primary', '#F8F9FA');
        stylelem.setProperty('--user-secondary', '#aaaaaa');
        stylelem.setProperty('--user-card', '#000B1C');
        stylelem.setProperty('--user-bg', '#001021');
    }else{
        stylelem.removeProperty('--user-primary');
        stylelem.removeProperty('--user-secondary');
        stylelem.removeProperty('--user-card');
        stylelem.removeProperty('--user-bg');
    }
}

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
        clone.querySelector(".school").textContent = student.house;
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