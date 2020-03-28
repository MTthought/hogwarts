"use strict";
window.addEventListener("DOMContentLoaded", init);

let allStudents = [];
let expelledStudents = [];
const HTML = {};
const settings = {
    filter: "*",
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
    HTML.studentTemplate = document.querySelector(".templates");
    HTML.dataList = document.querySelector("#dataList");
    HTML.expelledList = document.querySelector("#expelledList");
    HTML.modalContent = document.querySelector(".modal-content");
    HTML.pic = document.querySelector(".container > div > img");
    HTML.crest = document.querySelector(".container > img");
    HTML.modalFirstName = document.querySelector("#firstName");
    HTML.modalLastName = document.querySelector("#lastName");
    HTML.modalHouse = document.querySelector("#house");
    HTML.modalMiddleName = document.querySelector("#middleName");
    HTML.modalNickName = document.querySelector("#nickName");
    HTML.modalexpelHeading = HTML.modalContent.querySelector("h3");
    HTML.unsorted = document.querySelector("#nameSorting > option:nth-child(1)");
    HTML.options = document.querySelectorAll("select");
    HTML.expelBtn = document.querySelector("button");
    HTML.expelHeading = document.querySelector("body > h2");

    HTML.options.forEach(option => option.addEventListener("change", setSettings));
    HTML.expelBtn.addEventListener("click", expel);
    getData();
}

async function getData(){
    const response = await fetch("https://petlatkea.dk/2020/hogwarts/students.json");
    const students = await response.json();
    cleanUpData(students)
}

//string cleaner
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
    showStudents(allStudents, HTML.dataList);
}

function setSettings(){
    if(this.dataset.action === "filter"){
        settings.filter = this.value;
        filterHouse();
    }else if(this.dataset.action === "sort"){
        HTML.unsorted.setAttribute("disabled", true);
        settings.sortBy = this.value;
        sortName();
    }
}

//filtering
function setHouseFilter(a){
    const onlyHouse = a.filter(student => {
        if(student.house.toLowerCase() === settings.filter.toLowerCase()){
            return true;
        }else{
            return false;
        }
    });
    return onlyHouse;
}

function filterHouse(){
    if(settings.filter === "*"){
        showStudents(allStudents, HTML.dataList);
        if(expelledStudents.length !== 0){
            showStudents(expelledStudents, HTML.expelledList);
        }
    }else{
        showStudents(setHouseFilter(allStudents), HTML.dataList);
        showStudents(setHouseFilter(expelledStudents), HTML.expelledList);

        if(setHouseFilter(expelledStudents).length !== 0){
            HTML.expelHeading.classList.remove("optional");
        }else{
            HTML.expelHeading.classList.add("optional");
        }
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
        showStudents(allStudents, HTML.dataList);
    }
}

function showStudents(students, inner) {
    inner.innerHTML = "";

    students.forEach(student => {
        const clone = HTML.studentTemplate.cloneNode(true).content;
        clone.querySelector(".house").textContent = student.house;
        clone.querySelector(".name").textContent = `${student.firstName} ${student.lastName}`;
        clone.querySelector(".listItem").dataset.id = student.firstName;
        inner.appendChild(clone);
    })

    const items = document.querySelectorAll(".listItem");
    items.forEach(item => {
        item.addEventListener("click", popup);
    })
}

function getSingleStudent(id){
    if(allStudents.some(e => e.firstName === id )){
        return allStudents.find( ({ firstName }) => firstName === id );
    }else{
        return expelledStudents.find( ({ firstName }) => firstName === id );
    }
}

//modal taken from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

function popup(){
    const studentData = getSingleStudent(this.dataset.id);
    //const studentData = allStudents.find( ({ firstName }) => firstName === this.dataset.id );
    //console.log(studentData);
    HTML.modalContent.dataset.house = studentData.house;
    HTML.pic.src = studentData.pic;
    HTML.pic.alt = `${studentData.firstName}-picture`;
    HTML.crest.src = `img/${studentData.house}.svg`;
    HTML.crest.alt = `${studentData.house}-crest`;
    HTML.modalFirstName.textContent = studentData.firstName;
    HTML.modalLastName.textContent = studentData.lastName;
    HTML.modalHouse.textContent = studentData.house;
    HTML.expelBtn.dataset.id = studentData.firstName;

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

    if(expelledStudents.some(e => e.firstName === studentData.firstName)){
        modalExpelStyle();
    }else{
        HTML.expelBtn.classList.remove("optional");
        HTML.modalexpelHeading.classList.add("optional");
    }
    // to do: should add classList to keep separation of concerns
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

function modalExpelStyle(){
    HTML.expelBtn.classList.add("optional");
    HTML.modalexpelHeading.classList.remove("optional");
}

function expel(){
    //console.log(`Remove ${this.dataset.id}`);
    const studentData = getSingleStudent(this.dataset.id);
    expelledStudents.push(studentData);
    allStudents.splice(allStudents.indexOf(studentData), 1);
    modalExpelStyle();
    HTML.expelHeading.classList.remove("optional");
    filterHouse();
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