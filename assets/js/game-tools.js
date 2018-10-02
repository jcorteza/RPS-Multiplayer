var gameInProgress;
var newUsername;
var userKey;
var playerCount;
var waitingPlayers;
var spotInLine;
var alertClass = "row text-center alert";


/* function handles display of #userFormDiv, displaying and hiding it based on user's click. */
function collapseForm() {
    let action;
    if($(this).attr("id") === "yesPlay"){
        action = "show";
        $("#noPlay").removeAttr("aria-expanded");
        $(this).attr("aria-expanded", "true");
        $("#formHr").attr("class", "d-block");
    }
    else if($(this).attr("id") === "noPlay"){
        action = "hide";
        $("#yesPlay").removeAttr("aria-expanded");
        $(this).attr("aria-expanded", "false");
        $("#formHr").attr("class", "d-none");
    }
    $(".collapse").collapse(action);
    $("#playPromptDiv").add("#promptHr").toggle(false);
}

/* function checks the validity of the user's entry on click event of #userFormDiv */
function userNameValidty(event) {
    event.preventDefault();
    /* runs function validateFrom and returns true if valid or falise if not valid */
    let validEntry = validateForm();
    if(validEntry) {
        /* sets gloval varialbe newUsername equal to whatever the user entered */
        newUsername = $("#nameInput").val().trim();
        /* passes newUsername to checkUsername function which checks to see if the user's entry is already in use on the database */
        checkUsername(newUsername);
    }
}

/* checks the user's input in the page's form for validation against form pattern set in HTML */
function validateForm() {
    const form = $("form")[0];
    const input = form[0];
    let formValid = form.checkValidity();
    let inputValid = input.validity;
    let errorMessage;
    if(formValid) {
        return true;
    }
    else {
        if(inputValid.badInput){
            errorMessage = "Error: Bad input. Not quite what we were looking for. Please, try again.";
        }
        else if(inputValid.tooShort && inputValid.patternMismatch){
            errorMessage = "Error: That display name is too short!";
        }
        else if(inputValid.patternMismatch){
            errorMessage = "Error: Your entry includes characters other than letters and numbers. Please, try again.";
        }
        else if(inputValid.tooLong){
            errorMessage = "Error: That display name is too long!";
        }
        else if(inputValid.valueMissing){
            errorMessage = "Error: Display name is required, if you want to play Rock, Paper, Scissors.";
        }
        $("#gameAlertsDiv").html(errorMessage);
        $("#gameAlertsDiv").attr("class", alertClass + " alert-danger");
        $("#gameAlertsDiv").toggle(true);
        return false;
    }
}

/* firebase configuration variable */
var config = {
    apiKey: "AIzaSyAdX2ZA_iInB8Lj-U2ZSwIxESVcbc58Mik",
    authDomain: "rps-multiplayer-17cb8.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-17cb8.firebaseio.com",
    projectId: "rps-multiplayer-17cb8",
    storageBucket: "rps-multiplayer-17cb8.appspot.com",
    messagingSenderId: "802119263442"
  };

// Initialize Firebase
firebase.initializeApp(config);

var database = firebase.database();
var dbPlayers = database.ref("players");
var dbUsernames = database.ref("usernames");

/* function checks for the newUsername on the database and passes value of true or false to next function, which determins if the user can use the chosen display name and if so it is then passed to function that will set it up */
function checkUsername(newUsername) {
    let inUse;
    /* Definse username query to filter results that match the newly created username. */
    const usernameRef = dbUsernames.orderByKey().equalTo(newUsername);
    new Promise(function(resolve) {
        usernameRef.once("value", function(snapshot) {
            /* if the username exists return true*/
            if(snapshot.exists()){
                inUse = true;
                resolve();
                  
            }
            /* if the username doesn't exists, return false */
            else{
                inUse = false;
                resolve();
            }
        });
    }).then(function(){
        new Promise(function(resolve) {
            if(inUse) {
                $("#gameAlertsDiv").html("Sorry, that display name is in use. Try another one.");
                $("#gameAlertsDiv").attr("class", alertClass + " alert-danger");
                $("#gameAlertsDiv").toggle(true);
            }
            else if (!inUse){
                $("#nameInput").val("");
                /* playerCountSetup function checks firebase database for value of player_Count if it exist. Then uses a returned promise to run playerSetup function */
                playerSetup();
                /* Hides the form and "Do you want to play prompt and alerts the user their entry was successful. */
                $("#formHr").attr("class", "d-none");
                $(".collapse").collapse("hide");
                $("#gameAlertsDiv").html("Enry successful: That display name is <em>just</em> right!");
                $("#gameAlertsDiv").attr("class", alertClass + " alert-success");
                $("#gameAlertsDiv").toggle(true);
                setTimeout(function() {
                    $("#gameAlertsDiv").toggle(false)
                }, 4000);
            }
            resolve();
        });
    });
}

/* function adds new user info to the database */
function playerSetup() {
    userKey = database.ref().child("players").push({
        username: newUsername
    }).key;
    /* sets up a child object with a dynamic key name for usernames and adds it to the database. The "usernames" child will be referenced to check if name is already in use. */
    let usernameInfo = {};
    usernameInfo[newUsername] = true;
    database.ref("usernames").update(usernameInfo);
}




dbPlayers.onDisconnect().orderByKey().equalTo(userKey).remove();
dbUsernames.orderByKey().equalTo(newUsername).onDisconnect().remove();
