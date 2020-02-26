"use strict";
window.addEventListener("DOMContentLoaded", init);

const Student = {
    firstName: "",
    lastName: "-unknown-",
    middleName: null,
    nickName: null,
    pic: "",
    house: ""
}

const allStudents = [];

const HTML = {};

function init(){
    HTML.modalContent = document.querySelector(".modal-content");
    HTML.modalImg = document.querySelector(".container > img");
    HTML.modalFirstName = document.querySelector("#firstName");
    HTML.modalLastName = document.querySelector("#lastName");
    HTML.modalHouse = document.querySelector("#house");
    HTML.modalMiddleName = document.querySelector("#middleName");
    HTML.modalNickName = document.querySelector("#nickName");
    getData();
}

async function getData(){
    const response = await fetch("https://petlatkea.dk/2020/hogwarts/students.json");
    const students = await response.json();
    cleanUpData(students)
}

function clearSpace(name){
    if(name.indexOf(" ") === 0){
        if(name.lastIndexOf(" ") === name.length-1){
            return name.substring(1, name.length-1);
        }else{
            return name.substring(1, name.length);
        }
    }else if(name.lastIndexOf(" ") === name.length-1){
        return name.substring(0, name.length-1);
    }else{
        return name;
    }}

function rightCase(name){
    if(name.indexOf("-") === -1){
        return name.substring(0,1).toUpperCase() + name.substring(1, name.length).toLowerCase();
    }else{
        return name;
    }
}

function hasSpace(name){
    if(name.indexOf(" ") !== -1){
        return true;
    }else{
        return false;
    }
}

function cleanUpData(students){
    students.forEach(stud => {
        const clone = Object.create ( Student );
        //full name
        let fullName = clearSpace(stud.fullname);
        //first and last name
        let firstName;
        let lastName;
        if(hasSpace(fullName)){
            firstName = fullName.substring(0, fullName.indexOf(" "));
            lastName = fullName.substring(fullName.lastIndexOf(" ")+1, fullName.length);
            clone.lastName = rightCase(lastName);
        }else{
            firstName = fullName;
        }
        clone.firstName = rightCase(firstName);
        //middle and nick name
        let halfName = fullName.substring(fullName.indexOf(" ")+1, fullName.length);
        if(hasSpace(halfName)){
            let middleName = halfName.substring(0, halfName.lastIndexOf(" "));
            if(middleName.indexOf('"') === 0){
                let nickName = middleName.substring(1, middleName.lastIndexOf('"'));
                clone.nickName = nickName;
            }else{
                clone.middleName = rightCase(middleName);
            }
        }
        //house
        let house = clearSpace(stud.house);
        clone.house = rightCase(house);
        clone.pic = `img/${clone.house}.svg`;

        //console.log(clone);
        allStudents.push(clone);
    })
    showStudents();
}

function showStudents() {
    const studentTemplate = document.querySelector(".templates");
    const dataList = document.querySelector("#dataList");

    dataList.innerHTML = "";

    allStudents.forEach(student => {
        const clone = studentTemplate.cloneNode(true).content;
        clone.querySelector(".house").textContent = student.house;
        clone.querySelector(".name").textContent = `${student.firstName} ${student.lastName}`;
        clone.querySelector(".listItem").dataset.id = student.firstName;
        dataList.appendChild(clone);
    })

    const items = document.querySelectorAll(".listItem");
    items.forEach(item => {
        item.addEventListener("click", popup);
    })
}

const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

function popup(){
    const studentData = allStudents.find( ({ firstName }) => firstName === this.dataset.id );
    //console.log(studentData);
    HTML.modalContent.dataset.house = studentData.house;
    HTML.modalImg.src = studentData.pic;
    HTML.modalImg.alt = `${studentData.house}-crest`;
    HTML.modalFirstName.textContent = studentData.firstName;
    HTML.modalLastName.textContent = studentData.lastName;
    HTML.modalHouse.textContent = studentData.house;

    if(studentData.middleName){
        HTML.modalMiddleName.parentElement.classList.remove("optional");
        HTML.modalMiddleName.textContent = studentData.middleName;
    }else{
        HTML.modalMiddleName.parentElement.classList.add("optional");
    }

    if(studentData.nickName){
        HTML.modalNickName.parentElement.classList.remove("optional");
        HTML.modalNickName.textContent = studentData.nickName;
    }else{
        HTML.modalNickName.parentElement.classList.add("optional");
    }

    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
  }
  
window.onclick = function(event) {
if (event.target == modal) {
    modal.style.display = "none";
}
}