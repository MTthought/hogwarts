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
    bloodStatus: true,
    prefect: false,
    inquisitorialSquad: false,
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
    HTML.modalBloodStatus = document.querySelector("#bloodStatus");
    HTML.modalPrefect = document.querySelector("#prefect");
    HTML.modalSquad = document.querySelector("#inquisitorialSquad");
    HTML.modalexpelHeading = HTML.modalContent.querySelector("h3");
    HTML.errortitle = HTML.modalContent.querySelector("p");
    HTML.errormsg = HTML.modalContent.querySelector("p:nth-of-type(2)");
    HTML.expelBtn = document.querySelector("button");
    HTML.prefectBtn = document.querySelector("button:nth-of-type(2)");
    HTML.squadBtn = document.querySelector("button:nth-of-type(3)");
    HTML.unsorted = document.querySelector("#nameSorting > option:nth-child(1)");
    HTML.options = document.querySelectorAll("select");
    HTML.expelHeading = document.querySelector("body > h2");

    HTML.options.forEach(option => option.addEventListener("change", setOptions));
    HTML.search.addEventListener("keyup", setSearch);
    getData();
}

async function getData(){
    const studresponse = await fetch("https://petlatkea.dk/2020/hogwarts/students.json");
    const students = await studresponse.json();
    const famresponse = await fetch("https://petlatkea.dk/2020/hogwarts/families.json");
    const families = await famresponse.json();
    cleanUpData(students, families);
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

function cleanUpData(students, families){
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
        // blood-status
        if(filter(families.half, clone.lastName).length){
            clone.bloodStatus = false;
        }else{
            clone.bloodStatus = true;
        }

        allStudents.push(clone);
    })
    setCounter(allStudents.length);
    showStudents(allStudents, HTML.dataList);
}

function setSearch(){
    settings.search = HTML.search.value.trim();
    filterSearchOptions();
}

function setOptions(){
    if(this.dataset.action === "filter"){
        settings.filter = this.value;
        filterSearchOptions();
    }else if(this.dataset.action === "sort"){
        HTML.unsorted.setAttribute("disabled", true);
        settings.sortBy = this.value;
        sortName();
    }
    if(settings.hackedSystem){
        randBlood();
    }
}

// filtering
function filter(array, target){
    const match = array.filter(element => {
        //filters options house and search input if array contains objects
        if(typeof element === "object" 
        && (element.house.toLowerCase() === target.toLowerCase() 
        || element.firstName.toLowerCase().includes(target) 
        || element.lastName.toLowerCase().includes(target)) 
        //filters family if array contains strings
        || element === target){
            return true;
        }else{
            return false;
        }
    });
    return match;
}

function filterPrefect(array){
    const match = array.filter(element => {
        if(element.prefect === true){
            return true;
        }else{
            return false;
        }
    });
    return match;
}

function setCounter(onDisplay){
    let n = HTML.counter;
    n.querySelector("span:nth-child(1)").textContent = filter(allStudents, "Gryffindor").length;
    n.querySelector("span:nth-child(2)").textContent = filter(allStudents, "Hufflepuff").length;
    n.querySelector("span:nth-child(3)").textContent = filter(allStudents, "Ravenclaw").length;
    n.querySelector("span:nth-child(4)").textContent = filter(allStudents, "Slytherin").length;
    n.querySelector("span:nth-child(5)").textContent = allStudents.length;
    n.querySelector("span:nth-child(6)").textContent = expelledStudents.length;
    n.querySelector("span:nth-child(7)").textContent = onDisplay;
}

function filterView(students, expelled){
    setCounter(students.length + expelled.length);
    showStudents(students, HTML.dataList);
    showStudents(expelled, HTML.expelledList);

    if(expelled.length !== 0){
        listExpelStyle();
    }else{
        HTML.expelHeading.classList.add("d-none");
    }
}

function filterSearchOptions(){
    let students = filter(allStudents, settings.search.toLowerCase());
    let expStudents = filter(expelledStudents, settings.search.toLowerCase());

    if(settings.filter === "*"){
        filterView(students, expStudents)
    }else if(settings.filter === "expelled"){
        filterView([], expStudents);
    }else if(settings.filter === "nonExpelled"){
        filterView(students, []);
    }else{
        let house = settings.filter;
        filterView(filter(students, house), filter(expStudents, house))
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
    filterSearchOptions();
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

// The find() method returns the first value that matches from the array.
// Once it matches the value in findings, it will not check the remaining values in the array
function findStudent(id){
    if(allStudents.some(e => e.firstName === id )){
        return allStudents.find( ({ firstName }) => firstName === id );
    }else{
        return expelledStudents.find( ({ firstName }) => firstName === id );
    }
}

// modal start - taken from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal
const span = document.getElementsByClassName("close")[0];

function popup(){
    const studentData = findStudent(this.dataset.id);
    HTML.modalContent.dataset.house = studentData.house;
    HTML.modalContent.dataset.id = studentData.firstName;
    HTML.pic.src = studentData.pic;
    HTML.pic.alt = `${studentData.firstName}-picture`;
    HTML.crest.src = `img/${studentData.house}.svg`;
    HTML.crest.alt = `${studentData.house}-crest`;
    HTML.modalFirstName.textContent = studentData.firstName;
    HTML.modalLastName.textContent = studentData.lastName;
    HTML.modalHouse.textContent = studentData.house;
    if(studentData.bloodStatus){
        HTML.modalBloodStatus.textContent = "pure";
    }else{
        HTML.modalBloodStatus.textContent = "half";
    }
    HTML.expelBtn.addEventListener("click", expel);
    HTML.prefectBtn.addEventListener("click", prefect);
    text("prefect", studentData.prefect, HTML.modalPrefect, HTML.prefectBtn);
    if(studentData.bloodStatus || studentData.house === "Slytherin"){
        text("inquisitorial squad", studentData.inquisitorialSquad, HTML.modalSquad, HTML.squadBtn);
        HTML.modalSquad.parentElement.classList.remove("d-none");
        HTML.squadBtn.classList.remove("d-none");
        HTML.squadBtn.addEventListener("click", squad);
    }else{
        HTML.modalSquad.parentElement.classList.add("d-none");
        HTML.squadBtn.classList.add("d-none");
    }

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
        HTML.prefectBtn.classList.remove("d-none");
        HTML.modalexpelHeading.classList.add("d-none");
    }

    if(HTML.errortitle.parentElement.dataset.msg === "active"){
        HTML.errortitle.textContent = "";
        HTML.errormsg.textContent = "";
        HTML.errortitle.parentElement.dataset.msg = "inactive";
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
    const studentData = findStudent(HTML.modalContent.dataset.id);
    if(!studentData.cannotBeExpelled){
        if(studentData.prefect){
            prefect();
        }
        if(studentData.inquisitorialSquad){
            squad();
        }
        expelledStudents.push(studentData);
        allStudents.splice(allStudents.indexOf(studentData), 1);
        modalExpelStyle();
        filterSearchOptions();
    }
}

function modalExpelStyle(){
    HTML.expelBtn.classList.add("d-none");
    HTML.prefectBtn.classList.add("d-none");
    HTML.squadBtn.classList.add("d-none");
    HTML.modalexpelHeading.classList.remove("d-none");
}

function listExpelStyle(){
    HTML.expelHeading.classList.remove("d-none");
}

// making prefects
function prefect(){
    const studentData = findStudent(HTML.modalContent.dataset.id);
    const houseStudents = filter(allStudents, studentData.house);
    const housePrefects = filterPrefect(houseStudents);
    if(!studentData.prefect && housePrefects.length < 2){
        studentData.prefect = true;
    }else{
        studentData.prefect = false;
        if(housePrefects.length === 2 && !housePrefects.find(element => element === studentData)){
            HTML.errortitle.parentElement.dataset.msg = "active";
            HTML.errortitle.textContent = `Too many prefects at ${studentData.house}`;
            HTML.errormsg.textContent = `Revoke ${housePrefects[0].firstName} ${housePrefects[0].lastName} or ${housePrefects[1].firstName} ${housePrefects[1].lastName} 
            to make ${studentData.firstName} a prefect`;
        }
    }
    text("prefect", studentData.prefect, HTML.modalPrefect, HTML.prefectBtn);
}

// appointing to the inquisitorial squad
function squad(){
    const studentData = findStudent(HTML.modalContent.dataset.id);
    if(!studentData.inquisitorialSquad && (studentData.bloodStatus || studentData.house === "Slytherin")){
        studentData.inquisitorialSquad = true;

        if(settings.hackedSystem){
            setTimeout(function(){
                studentData.inquisitorialSquad = false;
                text("inquisitorial squad", studentData.inquisitorialSquad, HTML.modalSquad, HTML.squadBtn);
            }, 1000)
        }
    }else{
        studentData.inquisitorialSquad = false;
    }
    text("inquisitorial squad", studentData.inquisitorialSquad, HTML.modalSquad, HTML.squadBtn);
}

function text(type, value, DOMtext, DOMbtn){
    if(!value){
        DOMtext.textContent = "no";
        if(type === "prefect"){
            DOMbtn.textContent = `Make ${type}`;
        }else{
            DOMbtn.textContent = `Join ${type}`;
        }
    }else{
        DOMtext.textContent = "yes";
        DOMbtn.textContent = `Revoke ${type}`;
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
        randBlood();
        filterSearchOptions();
    }
}

function randBlood(){
    allStudents.forEach(student =>{
        if(Math.round(Math.random())){
            student.bloodStatus = true;
        }else{
            student.bloodStatus = false;
        }
    })
}