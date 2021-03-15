// container for all events for all days with 
var hours = [];

function setStorage(){
    localStorage.setItem("hour-description", JSON.stringify(hours));
}

function clearStorage(){
    hours = [];
    setStorage();
}

function getStorage(){
    hours = JSON.parse(localStorage.getItem("hour-description"));
    if(!hours){
        hours = [];
        return;
    }

    for(var i = 0; i < hours.length; i++){
        $(".d-flex").children().each(function(){
            if($(this).index() === hours[i].index) {
                $(this).find("textarea").val(hours[i].value);
            }
        });
    }
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

        // if in time frames, change time frame to corresponding color
        var textAreaEl = $("<textarea>").addClass("col-8 past");
        textAreaEl.val(this.#activity);

        // creates save button and span for icon
        var buttonEl = $("<button>").addClass("col-2 saveBtn");
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
    for(var i = 1; i < 25; i++){
        // if enters pm, change add pm to end
        if(i>12){
            hourText = (i - 12) + ":00 p.m.";
            // if exactly 12 in the pm, change to am
            if(i === 24) hourText = [hourText.slice(0, (hourText.length-4)), "a", hourText.slice((hourText.length-3))].join("");
        }
        // if in am, add am to end
        else{
            hourText = i + ":00 a.m.";
            // same as above but with pm
            if(i === 12) hourText = [hourText.slice(0, (hourText.length-4)), "p", hourText.slice((hourText.length-3))].join("");
        }
        // creates and initializes the new hour object
        hourEl = new hourTask(hourText, "");
        // makes the actual element to be appended
        hourEl.buildHourEl();
    }
}

$(document).ready(function () {
    $(".row").on("click", "button", function(){
        var ind = $(this).closest(".row").index();
        var val = $(this).closest(".row").find("textarea").val().trim();

        var hourObj = {
            year: 2020,
            day: 10,
            index: ind,
            value: val
        };

        debugger;
        var existingInd = hours.findIndex(selector => selector.index === ind);
        if(existingInd >= 0){
            if(!val) {
                hours.splice(existingInd, 1);
            }
            else{
                hours[existingInd].value = val;    
            }
        }
        else{
            hours.push(hourObj);    
        }

        setStorage();
    });

    $(".clearCatcher").on("click", "button", function(){
        clearStorage();
    });



});

function auditTask(hourEl, index){
    var textAEl = $(hourEl).find("textarea")
    var date = $("#currentDay")
      .text()
      .trim();
    var actualHour;
    if(index > parseInt($(hourEl).find(".hour").text().slice(0, -8))){
        actualHour = index;
    }
    else {
        actualHour = parseInt($(".hour").text().slice(0, -8));

    }
    var time = moment(date, "L").set("hour", actualHour);
    
    console.log($(hourEl).find(".hour").text().slice(0, -8));
    console.log(time);

    textAEl.removeClass("present future past");
    if(moment().isAfter(time)){
      textAEl.addClass("past");
    }
    else if(moment().isBefore(time)){
        textAEl.addClass("future");
    }
    if(Math.abs(moment().diff(time, "hours")) <= 1 &&  Math.abs(moment().diff(time, "hours")) >= 0){
        textAEl.removeClass("future");
        textAEl.addClass("present");
    }
    console.log(Math.abs(moment().diff(time, "hours")));
  }

buildDay();
$(".d-flex").children().each(function(index, el){
    debugger;
    moment().format("H HH");
    auditTask(el, index);
}, 5000);