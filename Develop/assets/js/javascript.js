// container for all events for all days with 
var hours = [];
// holds next day to check and progress hours
var nextDay;

// sets localstorage
function setStorage(){
    // stringifies objects to retain datum
    localStorage.setItem("hour-description", JSON.stringify(hours));
}

// clears local storage
function clearStorage(){
    hours = [];
    setStorage();
    location.reload();
}

// gets local strorage
function getStorage(){
    // parses objects to regain datum
    hours = JSON.parse(localStorage.getItem("hour-description"));
    // if an empty storage assign empty
    if(!hours){
        hours = [];
        return;
    }

    // checks and assigns any hour todo items to hours
    for(var i = 0; i < hours.length; i++){
        // loops through all rows
        $(".d-flex").children().each(function(){
            // id the current rows index is the same as the index of the todo entry
            if($(this).index() === hours[i].index) {
                // assign entry to that row
                $(this).find("textarea").val(hours[i].value);
            }
        });
    }
}

// calculates and assigns next day as well as reverts to current day
function setNextDay(){
    nextDay = moment().add(1, "days");
    moment().add(-1, "days");
}

// class for each time slot
class hourTask{
    // private vars for class
    #time;
    #activity;
    // constructor
    constructor(time, activity){
        this.#time = time;
        this.#activity = activity;
    }

    // builds the time slot composite element
    buildHourEl(){
        // creates the row
        var rowEl = $("<div>").addClass("row");
        // creates and sets the time section
        var h3El = $("<h3>").addClass("col-2 hour");
        h3El.text(this.#time);

        // provides default time frame and creates data entry field
        var textAreaEl = $("<textarea>").addClass("col-8 past");
        textAreaEl.val(this.#activity);

        // creates save button and span for icon
        var buttonEl = $("<button>");
        buttonEl.addClass("col-2 saveBtn");
        buttonEl.attr("title", "Save");
        
        var spanEl = $("<span>").addClass("oi oi-circle-check");
        // adds all elements together and to the page
        buttonEl.append(spanEl);
        rowEl.append(h3El, textAreaEl, buttonEl);
        $(".d-flex").append(rowEl);
        getStorage();
    }
}

// creates all hour elements for that day
function buildDay(){
    $("#currentDay").text(moment().format("l"));
    // initializing object container
    var hourEl;
    // initializing text content that will go into the object
    var hourText;
    // for all hours in the day
    for(var i = 0; i < 24; i++){
        // if enters pm, change add pm to end
        if(i > 12){
            hourText = (i - 12) + ":00 p.m.";
        }
        // if in am, add am to end
        else{
            hourText = i + ":00 a.m.";
            // if exactly 12 in the pm, change to am
            if(i === 12) hourText = [hourText.slice(0, (hourText.length-4)), "p", hourText.slice((hourText.length-3))].join("");
            // same as above but with pm
            if(i === 0) hourText = ["12", hourText.slice((hourText.length-8), (hourText.length-4)), "a", hourText.slice((hourText.length-3))].join("");
        }
        // creates and initializes the new hour object
        hourEl = new hourTask(hourText, "");
        // makes the actual element to be appended
        hourEl.buildHourEl();
    }
}

// waits for everything to generate before messing with elements
$(document).ready(function () {
    // on save button click
    $(".row").on("click", "button", function(){
        // find buttons rows index
        var ind = $(this).closest(".row").index();
        // gets new data
        var val = $(this).closest(".row").find("textarea").val().trim();
        // creates an hour object that saves the index and the value
        var hourObj = {
            index: ind,
            value: val
        };
        // check to see if the index has been changed already, if so get its index
        var existingInd = hours.findIndex(selector => selector.index === ind);
        // if the index exists, meaning its been changed
        if(existingInd >= 0){
            // and if the user has deleted the previous todo activity and left it blank
            if(!val) {
                // remove the newly emptied hour from the list
                hours.splice(existingInd, 1);
            }
            else{
                // otherwise, reassign the new activity
                hours[existingInd].value = val;    
            }
        }
        else{
            // if the index doesnt exist yet, save it in the list
            hours.push(hourObj);    
        }
        // save the changes
        setStorage();
    });

    // clears all activities when clicking the clear button at the bottom of the page
    $(".clearCatcher").on("click", "button", function(){
        clearStorage();
    });



});

// changes hour colors based on each hour and the current hour in terms of past present or future
function auditTask(hourEl, index){
    // gets this rows textarea
    var textAEl = $(hourEl).find("textarea")
    // removes all classes
    textAEl.removeClass("present future past");
    // if the difference between hours is negative, then this hour is in the past
    if((index - moment().format("H")) < 0 ){
        textAEl.addClass("past");
    }
    // if positive but also greater than 1, then it is in the future
    else if(index - moment().format("H") >= 1){
        textAEl.addClass("future");
    }
    // if between 0 and 1 then it is in the present hour
    else{
        textAEl.addClass("present");
    }
  }

// sets next day for comparison
setNextDay();
// builds this days hours
buildDay();
// checks all rows every 5 seconds if they have the correct class and if it is the next day
$(".d-flex").children().each(function(index, el){
    // passes the row and rows index to be audited
    auditTask(el, index);
    // if it is the next day
    if(moment() == nextDay){
        // empty previous days storage
        clearStorage();
        // gets the next day
        setNextDay();
        // bulds new day
        buildDay();
    }
}, 5000);