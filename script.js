"use strict";
window.addEventListener("DOMContentLoaded", init);

let allStudents = [];
const HTML = {};
const settings = {
    filter: null,
    sortBy: null
}
//the prototype for all students
const Student = {
    firstName: "",
    lastName: "-unknown-",
    middleName: null,
    nickName: null,
    pic: "img/blank-profile.png",
    house: ""
}

function init(){
    HTML.modalContent = document.querySelector(".modal-content");
    HTML.pic = document.querySelector(".container > div > img");
    HTML.crest = document.querySelector(".container > img");
    HTML.modalFirstName = document.querySelector("#firstName");
    HTML.modalLastName = document.querySelector("#lastName");
    HTML.modalHouse = document.querySelector("#house");
    HTML.modalMiddleName = document.querySelector("#middleName");
    HTML.modalNickName = document.querySelector("#nickName");
    HTML.btns = document.querySelectorAll("button");
    HTML.btns.forEach(btn => btn.addEventListener("click", setSettings));

    getData();
}

async function getData(){
    const response = await fetch("https://petlatkea.dk/2020/hogwarts/students.json");
    const students = await response.json();
    cleanUpData(students)
}

//clean strings
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
    if(hasHyphen(name)){
        return name;
    }else{
        return name.substring(0,1).toUpperCase() + name.substring(1, name.length).toLowerCase();
    }
}

function hasSpace(name){
    if(name.indexOf(" ") !== -1){
        return true;
    }else{
        return false;
    }
}

function hasHyphen(name){
    if(name.indexOf("-") === -1){
        return false;
    }else{
        return true;
    }
}

function cleanUpData(students){
    students.forEach(stud => {
        const clone = Object.create ( Student );
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
        //picture
        if(lastName !== undefined){
            let lowerSurname;
            if(hasHyphen(lastName)){
                lowerSurname = lastName.substring(lastName.indexOf("-")+1, lastName.length);
            }else{
                lowerSurname = lastName;
            }

            let nameLetter;
            if(lastName === "Patil"){
                nameLetter = firstName;
            }else{
                nameLetter = firstName.substring(0,1);
            }
            clone.pic = `img/${lowerSurname}_${nameLetter}.png`.toLowerCase();
        }
        //console.log(clone);
        allStudents.push(clone);
    })
    showStudents(allStudents);
}

function setSettings(){
    if(this.dataset.filter){
        settings.filter = this.dataset.filter;
        filterHouse();
    }else if(this.dataset.sort){
        settings.sortBy = this.dataset.sort;
        sortName();
    }
}

//filtering
function filterHouse(){
    if(settings.filter === "*"){
        showStudents(allStudents);
    }else{
        const onlyHouse = allStudents.filter(student => {
            if(student.house.toLowerCase() === settings.filter.toLowerCase()){
                return true;
            }else{
                return false;
            }
        });
        showStudents(onlyHouse);
    }
}

//sorting
function compareFirstName(a,b){
    if(a.firstName < b.firstName){
        return -1;
    }else{
        return 1;
    }
}

function compareLastName(a,b){
    if(a.lastName < b.lastName){
        return -1;
    }else{
        return 1;
    }
}

function sortName(){
    if(settings.sortBy === "firstName"){
        allStudents.sort(compareFirstName);
    }else if(settings.sortBy === "lastName"){
        allStudents.sort(compareLastName);
    }
    if(settings.filter){
        filterHouse();
    }else{
        showStudents(allStudents);
    }
}

function showStudents(students) {
    const studentTemplate = document.querySelector(".templates");
    const dataList = document.querySelector("#dataList");

    dataList.innerHTML = "";

    students.forEach(student => {
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

//modal taken from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

function popup(){
    const studentData = allStudents.find( ({ firstName }) => firstName === this.dataset.id );
    //console.log(studentData);
    HTML.modalContent.dataset.house = studentData.house;
    HTML.pic.src = studentData.pic;
    HTML.pic.alt = `${studentData.firstName}-picture`;
    HTML.crest.src = `img/${studentData.house}.svg`;
    HTML.crest.alt = `${studentData.house}-crest`;
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

//hacking the system
function hackTheSystem(){
    //console.log("hacked!");
    const mySelf = Object.create( Student );
    mySelf.firstName = "Adam";
    mySelf.house = "Gryffindor";
    //create cannotBeExpelled function
    mySelf.cannotBeExpelled = true;
    allStudents.push( mySelf );
    showStudents();
}