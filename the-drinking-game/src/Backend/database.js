import fire from './fire';
import {nhieRandomNumber} from './database-nhie';
import {mltRandomNumber} from './database-mlt';
import {ccRandomNumber} from './database-cc';
import {generateNewTriviaQuestion} from './database-trivia';
import {rtdRandomNumber} from './database-rtd';

const HIGHEST_VOTE_SCORE = 20;

export function createGame(playerName) {
    //TODO: Ensure game code doesn't exist already
    let gameCode = generateGameCode();
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode);
    ref.set({[playerName]: 0});

    // Redirect
    ref
        .child('redirect')
        .set(false);

    // List of people drinking
    ref
        .child('drinks')
        .child('No One')
        .set(true);

    // List of captions
    ref
        .child('captions')
        .child('No One')
        .set(true);

    // Number indicating which never have I ever question to pull
    ref
        .child('metadata')
        .child('nhie')
        .set(nhieRandomNumber());

    // Number indicating which most likely to question to pull
    ref
        .child('metadata')
        .child('mlt')
        .set(mltRandomNumber());

    // Number indicating which caption contest image to pull
    ref
        .child('metadata')
        .child('cc')
        .set(ccRandomNumber());

    // Trivia in JSON form
    generateNewTriviaQuestion().then((json) => {
        ref
            .child('metadata')
            .child('trivia')
            .set(json);
    });

    // Number indicating which 'Command' to pull
    ref
        .child('metadata')
        .child('rtd')
        .set(rtdRandomNumber());

    // String indicating username of player to do a command
    ref
        .child('metadata')
        .child('player')
        .set(playerName);

    // Round number
    ref
        .child('metadata')
        .child('round')
        .set(1);

    // Boolean indicating if full game is being played
    ref
        .child('metadata')
        .child('isFullGame')
        .set(false);

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

export function updateScore(username, gameCode, newScore) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode)
        .child(username);

    ref
        .once('value')
        .then((snapshot) => {
            fire
                .database()
                .ref('games')
                .child(gameCode)
                .child(username)
                .set(parseInt(snapshot.val(), 10) + newScore);
        });
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
    fire
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

export function resetValues(gameCode, value) {
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child(value)
        .remove();

    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child(value)
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

export function votePlayer(gameCode, player) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('votes')
        .child(player);

    ref
        .once('value')
        .then((snapshot) => {
            if (snapshot.val() !== null) {
                updateVotes(ref, snapshot.val());
            } else {
                ref.set(1);
            }
        });
}

function updateVotes(ref, oldScore) {
    ref.set(oldScore + 1);
}

export function getMostVoted(gameCode) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('votes');

    return ref
        .once('value')
        .then((snapshot) => {
            let votes = [];
            let highestVoteCount = 0;
            votes.push("No one voted, everyone drink!");
            if (snapshot.val() !== null) {
                snapshot.forEach((childSnapshot) => {
                    if (highestVoteCount === childSnapshot.val()) {
                        votes.push(childSnapshot.key);
                    } else if (highestVoteCount < childSnapshot.val()) {
                        votes = [];
                        votes.push(childSnapshot.key);
                        highestVoteCount = childSnapshot.val();
                    }
                });
            }
            let username = localStorage.getItem('username');
            if (votes.includes(username)) {
                updateScore(username, gameCode, HIGHEST_VOTE_SCORE);
            }
            return votes;
        });
}

export function resetVotes(gameCode) {
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('votes')
        .remove();
}

export function isFullGame(gameCode) {
    return fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('isFullGame')
        .once('value')
        .then((snapshot) => {
            return snapshot.val();
        });
}