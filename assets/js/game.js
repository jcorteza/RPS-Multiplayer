
function gameProgress() {
    console.log("Inside gameProgress function.");
    database.ref("game_in_progress").on("value", function(snapshot) {
            gameInProgress = snapshot.val();
    });
    let totalPlayers;
    let waitingPlayers;
    let playerNum;
    dbPlayerCount.once("value", function(snapshot) {
        totalPlayers = snapshot.val();
        waitingPlayers = snapshot.val() - 3;
    });
    if(gameInProgress) {
        console.log("There is a game in progress");
        setTimeout(function() {
            $("#gameInfoDiv").html("There is a game in progress. There are currently " + waitingPlayers + " player ahead of you in line.");
            $("#gameInfoDiv").attr("class", alertClass + " alert-info");
            $("#gameInfoDiv").toggle(true);
        }, 1000);
        playerNum = spotInLine();
        console.log("Your spot in line is " + playerNum);
    }
    else if(!gameInProgress && totalPlayers < 2){
        console.log("There is not a game in progress. Waiting on player 2");
        database.ref().update({
            game_in_progress: false
        });
        setTimeout(function() {
            $("#gameInfoDiv").html("Waiting on a Player 2.");
            $("#gameInfoDiv").attr("class", alertClass + " alert-info");
            $("#gameInfoDiv").toggle(true);
        }, 1000);
    }
    else if(!gameInProgress && totalPlayers >= 2){
        console.log("There is NOT a game in progress");
        playerNum = spotInLine();
        console.log(playerNum);
        if(playerNum <= 2 | totalPlayers === 2) {
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

function spotInLine() {
    let spotInLine = 0;
    dbPlayers.orderByKey().once("value", function(snapshot){
        console.log(userKey);
        snapshot.forEach(function(childSnapshot){
            spotInLine++;
            console.log(childSnapshot.key);
            if(childSnapshot.key === userKey){
                return spotInLine;
            }
        });
    });
}




/* Event listeners bound to collapseForm function. On #yesPlay button click form is shown requesting user to enter a display name. On #noPlay button click the form is hidden. */
$("#yesPlay").on("click", collapseForm);
$("#noPlay").on("click", collapseForm);

/* event listener binds submitBtn click to submitUsername */
$("#submitBtn").on("click", userNameValidty)