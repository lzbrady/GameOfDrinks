import fire from './fire';

export function createGame(playerName) {
    //TODO: Ensure game code doesn't exist already
    let gameCode = generateGameCode();
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .set({[playerName]: true});
    return gameCode;
}

export function joinGame(playerName, gameCode) {
    //TODO: Ensure player name doesn't already exist
    //TODO: Should we ensure game lobby exists
    let fireRef = fire
        .database()
        .ref('games')
        .child(gameCode);

    // Check if lobby exists
    return fireRef
        .once('value')
        .then((snapshot) => {
            if (snapshot.val() === null) {
                return {error: "Lobby Does Not Exist"};
            } else {
                return checkPlayerNameExists(playerName, gameCode);
            }
        });
}

function checkPlayerNameExists(playerName, gameCode) {
    // Check if player exists
    let playerRef = fire
        .database()
        .ref('games')
        .child(gameCode)
        .child(playerName);
    return playerRef
        .once('value')
        .then((snapshot) => {
            if (snapshot.val() !== null) {
                return {error: "Player Name Taken"};
            } else {
                return actuallyJoinGame(playerName, gameCode);
            }
        });
}

function actuallyJoinGame(playerName, gameCode) {
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child(playerName)
        .set(true);
    return {success: true};
}

export function removePlayer(playerName, gameCode) {
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child(playerName)
        .remove();
}

function generateGameCode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) 
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    return text;
}
