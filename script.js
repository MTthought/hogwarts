"use strict";
window.addEventListener("DOMContentLoaded", init);

let allStudents = [];
let expelledStudents = [];
const HTML = {};
const settings = {
    filter: "*",
    sortBy: null,
    search: "",
    hackedSystem: false
}
// the prototype for all students
const Student = {
    firstName: "",
    lastName: "-unknown-",
    middleName: null,
    nickName: null,
    pic: "img/blank-profile.png",
    house: "",
    cannotBeExpelled: false
}

function init(){
    HTML.studentTemplate = document.querySelector(".templates");
    HTML.search = document.querySelector("#search");
    HTML.counter = document.querySelector(".studentNumbers");
    HTML.dataList = document.querySelector("#dataList");
    HTML.expelledList = document.querySelector("#expelledList");
    HTML.modal = document.getElementById("myModal");
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
    HTML.search.addEventListener("keyup", setSettings);
    HTML.expelBtn.addEventListener("click", expel);
    getData();
}

async function getData(){
    const response = await fetch("https://petlatkea.dk/2020/hogwarts/students.json");
    const students = await response.json();
    cleanUpData(students);
}

// string cleaner
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
        // first and last name
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
        // middle and nick name
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
        // house
        let house = clearSpace(stud.house);
        clone.house = rightCase(house);
        // picture
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
        allStudents.push(clone);
    })
    filter();
}

function setSettings(){
    if(this.type==="text"){
        settings.search = HTML.search.value.trim();
        filter();
    }
    if(this.dataset.action === "filter"){
        settings.filter = this.value;
        filter();
    }else if(this.dataset.action === "sort"){
        HTML.unsorted.setAttribute("disabled", true);
        settings.sortBy = this.value;
        sortName();
    }
}

function modalExpelStyle(){
    HTML.expelBtn.classList.add("d-none");
    HTML.modalexpelHeading.classList.remove("d-none");
}

function listExpelStyle(){
    HTML.expelHeading.classList.remove("d-none");
}

// filtering
function filterSearch(){
    const match = allStudents.filter(student => {
        if(student.firstName.toLowerCase().includes(settings.search.toLowerCase()) 
        || student.lastName.toLowerCase().includes(settings.search.toLowerCase())){
            return true;
        }else{
            return false;
        }
    });
    return match;
}

function filterHouse(a, house){
    const onlyHouse = a.filter(student => {
        if(student.house.toLowerCase() === house.toLowerCase()){
            return true;
        }else{
            return false;
        }
    });
    return onlyHouse;
}

function setCounter(onDisplay){
    let n = HTML.counter;
    n.querySelector("span:nth-child(1)").textContent = filterHouse(allStudents, "Gryffindor").length;
    n.querySelector("span:nth-child(2)").textContent = filterHouse(allStudents, "Hufflepuff").length;
    n.querySelector("span:nth-child(3)").textContent = filterHouse(allStudents, "Ravenclaw").length;
    n.querySelector("span:nth-child(4)").textContent = filterHouse(allStudents, "Slytherin").length;
    n.querySelector("span:nth-child(5)").textContent = allStudents.length;
    n.querySelector("span:nth-child(6)").textContent = expelledStudents.length;
    n.querySelector("span:nth-child(7)").textContent = onDisplay;
}

function filter(){
    let students = filterSearch();

    if(settings.filter === "*"){
        setCounter(students.length + expelledStudents.length);
        showStudents(students, HTML.dataList);

        if(expelledStudents.length !== 0){
            listExpelStyle();
            showStudents(expelledStudents, HTML.expelledList);
        }
    }else{
        let filter = settings.filter;
        let houseStudents = filterHouse(students, filter);
        let expHouseStudents = filterHouse(expelledStudents, filter);
        setCounter(houseStudents.length + expHouseStudents.length);
        showStudents(houseStudents, HTML.dataList);
        showStudents(expHouseStudents, HTML.expelledList);

        if(filterHouse(expelledStudents, filter).length !== 0){
            listExpelStyle();
        }else{
            HTML.expelHeading.classList.add("d-none");
        }
    }
}

// sorting
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
    filter();
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

// modal start - taken from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal
const span = document.getElementsByClassName("close")[0];

function popup(){
    const studentData = getSingleStudent(this.dataset.id);
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
        HTML.modalMiddleName.parentElement.classList.remove("d-none");
        HTML.modalMiddleName.textContent = studentData.middleName;
    }else{
        HTML.modalMiddleName.parentElement.classList.add("d-none");
    }

    if(studentData.nickName){
        HTML.modalNickName.parentElement.classList.remove("d-none");
        HTML.modalNickName.textContent = studentData.nickName;
    }else{
        HTML.modalNickName.parentElement.classList.add("d-none");
    }

    if(expelledStudents.some(e => e.firstName === studentData.firstName)){
        modalExpelStyle();
    }else{
        HTML.expelBtn.classList.remove("d-none");
        HTML.modalexpelHeading.classList.add("d-none");
    }
    HTML.modal.classList.remove("d-none");
}

span.onclick = function() {
    HTML.modal.classList.add("d-none");
  }
  
window.onclick = function(event) {
if (event.target == HTML.modal) {
    HTML.modal.classList.add("d-none");
}
}
// modal end

// expelling students
function expel(){
    const studentData = getSingleStudent(this.dataset.id);
    if(studentData.cannotBeExpelled === false){
        expelledStudents.push(studentData);
        allStudents.splice(allStudents.indexOf(studentData), 1);
        modalExpelStyle();
        filter();
    }
}

// hacking the system
function hackTheSystem(){
    // the system keeps track of whether it has been hacked
    if (!settings.hackedSystem){
        settings.hackedSystem = true;
        const mySelf = Object.create( Student );
        mySelf.firstName = "MTthought";
        mySelf.house = "Gryffindor";
        mySelf.cannotBeExpelled = true;
        allStudents.push( mySelf );
        filter();
    }
}