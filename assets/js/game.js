function waitInLine() {
    return new Promise(function(resolve) {
        spotInLine = 0;
        dbPlayers.orderByKey().once("value", function(snapshot){
            console.log(userKey);
            snapshot.forEach(function(childSnapshot){
                spotInLine++;
                if(childSnapshot.key === userKey){
                    console.log("Keys match.");
                    resolve();
                }
            });
        });
    });
}

/* function that evaluates the progress of the game */
function gameProgress() {
    if(gameInProgress) {
        console.log("There is a game in progress.");
        if(spotInLine === 3) {
            setTimeout(function() {
                $("#gameInfoDiv").html("There is a game in progress, but you're up next.");
                $("#gameInfoDiv").attr("class", alertClass + " alert-info");
                $("#gameInfoDiv").toggle(true);
            }, 1000);
        }
        else if(spotInLine === 4) {
            setTimeout(function() {
                $("#gameInfoDiv").html("There is a game in progress. There is currently 1 player ahead of you in line.");
                $("#gameInfoDiv").attr("class", alertClass + " alert-info");
                $("#gameInfoDiv").toggle(true);
            }, 1000);
        }
        else if(spotInLine > 4) {
            setTimeout(function() {
                $("#gameInfoDiv").html("There is a game in progress. There are currently " + waitingPlayers + " players ahead of you in line.");
                $("#gameInfoDiv").attr("class", alertClass + " alert-info");
                $("#gameInfoDiv").toggle(true);
            }, 1000);
        }
    }
    else if(!gameInProgress && spotInLine > 2) {
        console.log("There is NOT a game in progress (i.e. both players have not made their selection), but it is not the player's turn.");
        if(spotInLine === 3) {
            setTimeout(function() {
                $("#gameInfoDiv").html("It's not your turn now, but you're up next.");
                $("#gameInfoDiv").attr("class", alertClass + " alert-info");
                $("#gameInfoDiv").toggle(true);
            });
        }
        else if(spotInLine === 4) {
            setTimeout(function() {
                $("#gameInfoDiv").html("It's not your turn now. There is 1 player ahead of you in line.");
                $("#gameInfoDiv").attr("class", alertClass + " alert-info");
                $("#gameInfoDiv").toggle(true);
            });
        }
        else if(spotInLine > 4) {
            setTimeout(function() {
                $("#gameInfoDiv").html("It's not your turn now. There are currently " + waitingPlayers + " players ahead of you in line");
                $("#gameInfoDiv").attr("class", alertClass + " alert-info");
                $("#gameInfoDiv").toggle(true);
            });
        }
    }
    else if(!gameInProgress && spotInLine <= 2) {
        if(playerCount < 2) {
            console.log("There is not a game in progress. Waiting on player 2");
            database.ref().update({
                game_in_progress: false
            });
            setTimeout(function() {
                $("#gameInfoDiv").html("Waiting on a Player 2 to start the game.");
                $("#gameInfoDiv").attr("class", alertClass + " alert-info");
                $("#gameInfoDiv").toggle(true);
            }, 1000);
        }
        else {
            database.ref().update({
                game_in_progress: true
            });
            setTimeout(function() {
                $("#gameInfoDiv").html("Your move! Take your pick.");
                $("#gameInfoDiv").attr("class", alertClass + " alert-info");
                $("#gameInfoDiv").toggle(true);
                $("#gameChoicesDiv").attr("class", "row my-2");
                setTimeout(function() {
                    $("#gameInfoDiv").toggle(false)
                }, 5000)
            }, 1000);
        }
    }
}

/* Event listeners bound to collapseForm function. On #yesPlay button click form is shown requesting user to enter a display name. On #noPlay button click the form is hidden. */
$("#yesPlay").on("click", collapseForm);
$("#noPlay").on("click", collapseForm);

/* event listener binds submitBtn click to submitUsername */
$("#submitBtn").on("click", userNameValidty)

database.ref("game_in_progress").on("value", function(snapshot) {
        gameInProgress = snapshot.val();
});

dbPlayers.on("value", function(snapshot) {
    playerCount = snapshot.numChildren();
        if(playerCount >= 3) {
            waitingPlayers = playerCount - 3;
        }
        else {
            waitingPlayers = null;
        }
    waitInLine().then(function() {
        gameProgress();
        new Promise(function(resolve) {
            resolve();
        });
    });
});