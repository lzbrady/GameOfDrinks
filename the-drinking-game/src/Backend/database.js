import fire from './fire';
import {nhieRandomNumber} from './database-nhie';
import {mltRandomNumber} from './database-mlt';

export function createGame(playerName) {
    //TODO: Ensure game code doesn't exist already
    let gameCode = generateGameCode();
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode);
    ref.set({[playerName]: 0});
    ref
        .child('redirect')
        .set(false);
    ref
        .child('drinks')
        .child('No One')
        .set(true);
    ref
        .child('metadata')
        .child('nhie')
        .set(nhieRandomNumber());
    ref
        .child('metadata')
        .child('mlt')
        .set(mltRandomNumber());
    return gameCode;
}

export function joinGame(playerName, gameCode) {
    //TODO: Check to make sure players < 8
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
    // TODO: make this work
    if (playerName === 'redirect' || playerName === 'metadata' || playerName === 'drinks') {
        console.log("ERROR");
        return {error: "Invalid Player Name"};
    }
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
        .set(0);
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

export function redirect(gameCode, redirectTo) {
    return fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('redirect')
        .set(redirectTo);
}

export function getDrinks(gameCode) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('drinks');
    return ref
        .once('value')
        .then((snapshot) => {
            return snapshot;
        })
}

export function updateDrinks(gameCode, username) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('drinks')
        .child(username)
        .set(true);

    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('drinks')
        .child('No One')
        .set(false);
}

export function resetDrinks(gameCode) {
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('drinks')
        .remove();

    let ref = fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('drinks')
        .child('No One')
        .set(true);
}

export function getPlayers(gameCode) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode);
    return ref.once('value', (snapshot) => {
        return snapshot;
    });
}