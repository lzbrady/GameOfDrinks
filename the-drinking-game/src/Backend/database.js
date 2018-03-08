import fire from './fire';

export function createGame(playerName) {
    //TODO: Ensure game code doesn't exist already
    let gameCode = generateGameCode();
    let gameRef = fire
        .database()
        .ref('games')
        .child(gameCode)
        .set({[playerName]: true});
    return gameCode;
}

export function joinGame(playerName, gameCode) {
    //TODO: Ensure player name doesn't already exist
    let gameRef = fire
        .database()
        .ref('games')
        .child(gameCode)
        .child(playerName)
        .set(true);
}

function generateGameCode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) 
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    return text;
}
