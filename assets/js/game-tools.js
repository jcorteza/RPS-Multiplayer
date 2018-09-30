var alertClass = "row text-center alert";
var gameInProgress = "false";
var newUsername;
var playerCount;

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
    let validEntry = validateForm();
    if(validEntry) {
        newUsername = $("#nameInput").val().trim();
        $("#nameInput").empty();
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

function playerCountSetup() {
    dbPlayerCount.on("value", function(snapshot) {
        // console.log($.type(snapshot.val()));
        if($.type(snapshot.val()) === "null"){
            console.log("No player count.");
            database.ref().set({
                player_Count: 0
            });
        }
        else {
            playerCount = snapshot.val();
        }
    });
}