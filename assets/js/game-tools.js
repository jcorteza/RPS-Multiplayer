const alertClass = "row text-center alert";


$("form").noValidate = true;
$("form").onSubmit = validateForm;
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
    validateForm();
}

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
    /* checks to see if #nameInput is an empty string */
    /*if(!nameVal) {
        $("#gameAlertsDiv").html("Display name need to be filled out in order to play. Please enter a 5 to 9 character display name for the game.");
        alertClass = $("#gameAlertsDiv").attr("class");
        alertClass = alertClass + " alert-danger";
        $("#gameAlertsDiv").attr("class", alertClass);
        $("#gameAlertsDiv").toggle(true);
    }
    else if(nameVal) {
        if(nameVal.length < 5) {
            let isValid = form.checkValidity();
            console.log(isValid);
            console.log(input.validity);
            console.log(input.validity.patternMismatch);
            $("#gameAlertsDiv").html("That display name is too short!");
            alertClass = $("#gameAlertsDiv").attr("class");
            alertClass = alertClass + " alert-danger";
            $("#gameAlertsDiv").attr("class", alertClass);
            $("#gameAlertsDiv").toggle(true);
        }
        else if(nameVal.length > 9) {
            let isValid = form.checkValidity();
            console.log(isValid);
            console.log(input.validity);
            console.log(input.validity.patternMismatch);
            $("#gameAlertsDiv").html("That display name is too long!");
            alertClass = $("#gameAlertsDiv").attr("class");
            alertClass = alertClass + " alert-danger";
            $("#gameAlertsDiv").attr("class", alertClass);
            $("#gameAlertsDiv").toggle(true);
        }
        else if(5 <= nameVal.length <= 9) {
            console.log("Just right.");
            if(!form.checkValidity()) {
                console.log(input.validity.badInput);
                console.log(input.validity.customError);
                console.log(input.validity.patternMismatch);
                console.log(input.validity.badInput);
                console.log(input.validity.badInput);
                console.log(input.validity.badInput);
                console.log(input.validity.badInput);
                console.log(input.validity.badInput);
                console.log(input.validity.badInput);
            }
        }
    }*/
}