# Hacked Hogwarts Student List
JavaScript ES6 project (with CSS and HTML). No frameworks or plugins.

## The backstory:
You have been hired as the frontender for Hogwarts School of Witchcraft and Wizardry, to build a system to help the administrators handle student lists. As test-data you are given the students from the infamous class of 1991.

First, you are just asked to provide an interface to show the list, sort by firstname, lastname, or house, as well as filter by house. Also the interface must provide a "popup" window with detailed information about each student, including photo and house-crest and colors.

As you finish your assignment, you are asked to expand on the solution - the administrator must be able to expel individual students, and see a list of expelled students. On a less dramatic note, two students from each house can be selected as prefects, and this should show in their "popup".

Then the customer experiences a massive shift in political view, and you are bombarded with additional requirements. In addition to prefects, some students can be appointed to join the inquisitorial squad. You are also tasked with implementing racial profiling, by adding "blood-status" to each student - something the original data doesn't have, so you need to devise an algorithm for figuring out a students heritage based on lists of family-names.

You grow a bit tired of these new modifications, so you decide to hack the system. First you want to infiltrate the school, so you "inject" yourself in the list of students (in the house of your choice), and make sure that you can't be expelled by the administrator.

Additionally you break the inquisitorial squad by removing students, shortly after the administrator has added them. And finally you mess up your pure-blood algorithm, so it is rather random whether a student is shown as pure-, half-, or muggle-blood.

## User requirements
These are the collected specific requirements from the user, note that additional requirements might influence how you should design the solution, so read all of them, before beginning work.

### The data
The list of students is to be read from: https://petlatkea.dk/2020/hogwarts/students.json (you can use http or https). The data only contains full names of students, but your solution is expected to split into first, middle, last, and optional nick names. The data is in quite a state, but cannot be expected to be fixed, so your code must clean it properly.

You can download images of the students from: https://petlatkea.dk/2020/hogwarts/images.zip or use your own, but keep the filenames!

### The list
The solution must display a list of students. The list is intended for administrators to get a quick overview of the students in the current year, and sort, filter, and search for certain properties.

### Sorting
The administrator must be able to sort the list on at least first, and last names. Also a kind of sort, that would group e.g. students in the same house, or those with certain responsibilities (could be quidditch-players, -captains, prefects, or club memberships).

### Filtering
The administrator must be able to filter the view, so only students from one house is shown. Also, filters that only showed those with certain responsibilities, or other properties would be nice.

Uh, and filtering expelled vs non-expelled students is certainly a requirement!

### Searching
The administrator must be able to quickly search for a student, e.g. by first name or last name. A search field, that immediately limits the listed students to those matching the search criteria, would be nice. E.g. search for "ha" would show Harry Potter, Hannah Abbott, Zacharias Smith, and Michael Corner.

### About
The interface must show some details about the lists:
* Number of students in each house
* Total number of students (not expelled)
* Number of students expelled
* Number of students currently displayed

### Details-popup
The administrator must be able to select a student, and get a "popup" with details.

This popup must be decorated (or "themed" as it is called) with the house crest and colors of the selected student. And must show:
* First name
* Middle name (if any)
* Nick name (if any)
* Last name
* Photo of student (if exists)
* House Crest and colors
* Blood-status
* If the student is:
  * prefect or not
  * expelled or not
  * member of inquisitorial squad or not

### Expelling students
The user must be able to expel a student. You decide if the expelling should be done from the list, or from the "popup". Expelling removes a student from the list of students, and adds it to another list of expelled students. Once expelled, a student cannot return to the original list.

Note: Since the JSON-file cannot be modified, no changes will last through a reload. That is okay.

### Prefects
Only two students from each house can be selected prefects. Usually a boy and a girl.

The user must be able to make any student a prefect, and also revoke the prefect-status at any time. You must include some sort of system to prevent more than two prefects from each house. It is up to you how to design this. If the user must manually revoke one prefect before creating a new, or if there is simply a confirmation box for this. You can also decide if you want to continue the gender-specific prefects, or allow two boys or two girls. 

### Blood-status
The system must calculate blood-status for each student. This is an indication of whether the student is from a pure wizarding family, or from a half-wizard, half-muggle family, or just plain muggle.

Use this list: https://petlatkea.dk/2020/hogwarts/families.json that is a list of all known pure-blooded wizarding families, as well as a list of some of the known half-bloods. Note that some pure-bloods have mixed with muggles, and have become half-bloods.

You must decide what to do when a name occurs in both lists - either respect the tradition of the pure-blood, and ignore the half-blood part, or take the stricter approach and mark any possible half-blood as just that, half-blood.

### Inquisitorial Squad
The user must be able to appoint students to the inquisitorial squad, and remove them again. Any number of students can be appointed, but only pure-blood or students from Slytherin (should any non-pure-blood be in that house).

### Hacking
You must create a function called hackTheSystem() that performs, or activates, the hacking when called. You can add a secret button or keystroke that the user can enter to hack the system, but it must also be possible to do from the console.

Hacking must result in (atleast) three things happening:
1. You will be injected, with your own name, into the list of students. You should remain in the lists, until a reload happens, and if the user tries to expel you, there should be a warning of some sorts - you cannot be expelled!
2. The blood-status is no longer thrustworthy. Former pure-bloods will get completely random blood-status, whereas half- and muggle-bloods will be listed as pure-blood. If you can randomly modify the former pure-bloods on every redisplay (sort or filter) of the list, the better!
3. Adding a student to the inquisitorial squad will only work for a limited time, before the student is automatically removed again. Preferably so the user notices that the student gets removed.

Calling hackTheSystem() multiple times, shouldn't make any difference - so make sure that the system keeps track of whether it has been hacked.
