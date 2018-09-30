var alertClass = "row text-center alert";
var gameInProgress = "false";
var newUsername;
// var playerCount;

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
}

/* function handles the submit click event of #userFormDiv */
function submitUsername(event) {
    event.preventDefault();
    console.log("subitUsername validates form");
    let validEntry = validateForm();
    if(validEntry) {
        console.log("Form is valid. Form sets newUsername variable.");
        newUsername = $("#nameInput").val().trim();
        $("#nameInput").val("");
        /* function checks firebase database for value of player_Count if it exist.s */
        console.log("Form runs playerCountSetup function. Then runs playerSetup function once promise is completed.");
        playerCountSetup();
    }
    else {
        console.log("Form is not valid.");
    }
}

/* checks the user's input in the page's form for validation against form pattern set in HTML */
function validateForm() {
    const form = $("form")[0];
    const input = form[0];
    let formValid = form.checkValidity();
    let inputValid = input.validity;
    let errorMessage;
    if(formValid){
        $("#gameAlertsDiv").html("That display name is <em>just</em> right!");
        $("#gameAlertsDiv").attr("class", alertClass + " alert-success");
        $("#gameAlertsDiv").toggle(true);
        return formValid;
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
var dbPlayerCount = database.ref("player_Count");
var dbPlayers = database.ref("players");

/* function checks if player_Count is a key that exists on firebase. If not, it sets it up with a value of 0. Otherwise it sets playerCount to the current value. */
function playerCountSetup() {
    var playerCount;
    console.log("Inside playerCountSetup function.");
    dbPlayerCount.once("value", function(snapshot) {
        // console.log($.type(snapshot.val()));
        console.log("checking database");
        if($.type(snapshot.val()) === "null"){
            console.log("No player count.");
            database.ref().set({
                player_Count: 0
            });
            playerCount = 0;
        }
        else {
            playerCount = snapshot.val();
            console.log("player_Count exists. Current value is " + snapshot.val());
        }
        new Promise(function(resolve) {
                resolve(playerCount);
        }).then(successResult);
    });
}

function playerSetup(playerCount) {
    console.log("Inside playerSetup function.");
    console.log("Value of playerCount passed through playerSetup function is " + playerCount);
    /*adds 1 to playerCount var, then sets database key player_Count to updated value of playerCount var */
    playerCount++;
    console.log("New count is " + playerCount + ". Database updated with new playerCount.");
    database.ref().update({
        player_Count: playerCount
    });
    let playerInfo = {};
    playerInfo["player" + playerCount] = {
        username: newUsername
    }
    console.log("Database updated with new player info.");
    database.ref("players").update(playerInfo);
    console.log("New player fully setup.")
}

function successResult(playerCount) {
    new Promise(function(resolve) {
        playerSetup(playerCount);
        resolve();
    });
}
/* alerts user to something going wrong when a function promise fails */
function errorResult() {
    $("#gameAlertsDiv").html("Whoops! Something went wrong.");
    $("#gameAlertsDiv").attr("class", alertClass + " alert-danger");
    $("#gameAlertsDiv").toggle(true);
    console.log("Problem with playerCountSetup function.");
    resolve("Problem with playerCountSetup function.");
}