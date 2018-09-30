/* Event listeners bound to collapseForm function. On #yesPlay button click form is shown requesting user to enter a display name. On #noPlay button click the form is hidden. */
$("#yesPlay").on("click", collapseForm);
$("#noPlay").on("click", collapseForm);

/* event listener binds submitBtn click to submitUsername */
$("#submitBtn").on("click", submitUsername);

/*
if(database.ref("/player_Count")){
    playerCount = database.ref("/player_Count");
    playerCount++;
    database.ref().update({
        player_Count: playerCount,
    })
    database.ref("/players/player" + playerCount).push({
        username: newUsername
    });
}
*/