import fire from './fire';
import {nhieRandomNumber} from './database-nhie';
import {mltRandomNumber} from './database-mlt';
import {ccRandomNumber} from './database-cc';
import {generateNewTriviaQuestion} from './database-trivia';
import {rtdRandomNumber} from './database-rtd';

const HIGHEST_VOTE_SCORE = 20;

export function createGame(playerName) {
    if (playerName.trim() === "" || playerName === 'redirect' || playerName === 'metadata' || playerName === 'drinks' || playerName === 'captions') {
        return {error: "Invalid Player Name"};
    }

    //TODO: Ensure game code doesn't exist already
    let gameCode = generateGameCode();
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode);
    ref.set({
        [playerName.trim()]: 0
    });

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

    // Boolean indicating point ceremony should happen
    ref
        .child('metadata')
        .child('pointCeremony')
        .set(false);

    return gameCode;
}

export function joinGame(playerName, gc) {
    let gameCode = gc.toUpperCase();
    // Check to make sure players < 8
    let fireRef = fire
        .database()
        .ref('games')
        .child(gameCode);

    // Check if lobby exists
    return fireRef
        .once('value')
        .then((snapshot) => {
            if (snapshot.val() === null) {
                return {error: "Invalid Game Code"};
            } else {
                return checkPlayerNameExists(playerName, gameCode);
            }
        });
}

function checkPlayerNameExists(playerName, gameCode) {
    if (playerName.trim() === "" || playerName === 'redirect' || playerName === 'metadata' || playerName === 'drinks' || playerName === 'captions') {
        return {error: "Invalid Player Name"};
    }

    // Check if player exists
    let playerRef = fire
        .database()
        .ref('games')
        .child(gameCode);

    return playerRef
        .once('value')
        .then((snapshot) => {
            let totalPlayers = 0;
            if (snapshot.val() !== null) {
                let nameTaken = false;
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.key !== 'redirect' && childSnapshot.key !== 'metadata' && childSnapshot.key !== 'drinks' && childSnapshot.key !== 'captions') {
                        if (childSnapshot.key.trim() === playerName.trim()) {
                            nameTaken = true;
                        } else {}
                        totalPlayers++;
                    }
                });
                if (totalPlayers < 8) {
                    if (nameTaken) {
                        return {error: "Player Name Taken"};
                    } else {
                        return actuallyJoinGame(playerName, gameCode);
                    }
                } else {
                    return {error: "Lobby Full"};

                }
            }
        });
}

function actuallyJoinGame(playerName, gameCode) {
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child(playerName.trim())
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

    localStorage.setItem("username", "");

    gameIsEmpty(gameCode).then((isEmpty) => {
        if (isEmpty) {
            fire
                .database()
                .ref('games')
                .child(gameCode)
                .remove();
        }
    })
}

function gameIsEmpty(gameCode) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode);

    return ref
        .once('value')
        .then((snapshot) => {
            if (snapshot.val() !== null) {
                let totalPlayers = 0;
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.key !== 'redirect' && childSnapshot.key !== 'metadata' && childSnapshot.key !== 'drinks' && childSnapshot.key !== 'captions') {
                        totalPlayers++;
                    }
                });
                if (totalPlayers == 0) {
                    return true;
                }
                return false;
            } else {
                return true;
            }
        });
}

export function isActuallyInGame(gameCode, playerName) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode);

    return ref
        .once('value')
        .then((snapshot) => {
            if (snapshot.val() !== null) {
                let nameExists = false;
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.key !== 'redirect' && childSnapshot.key !== 'metadata' && childSnapshot.key !== 'drinks' && childSnapshot.key !== 'captions') {
                        if (childSnapshot.key === playerName) {
                            nameExists = true;
                        }
                    }
                });
                return nameExists;
            } else {
                return true;
            }
        });
}

function generateGameCode() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

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

    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('nhie')
        .set(nhieRandomNumber());

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
            votes.push("Everyone!");
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

export function getResults(gameCode) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode);
    return ref
        .once('value')
        .then((snapshot) => {
            let first = {
                name: "",
                points: 0
            };
            let second = {
                name: "",
                points: 0
            };
            let third = {
                name: "",
                points: 0
            };

            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.key !== 'redirect' && childSnapshot.key !== 'metadata' && childSnapshot.key !== 'drinks' && childSnapshot.key !== 'captions') {
                    if (childSnapshot.val() > first.points || first.name === "") {
                        third.name = second.name;
                        third.points = second.points;

                        second.name = first.name;
                        second.points = first.points;

                        first.name = childSnapshot.key;
                        first.points = childSnapshot.val();
                    } else if (childSnapshot.val() > second.points || second.name === "") {
                        third.name = second.name;
                        third.points = second.points;

                        second.name = childSnapshot.key;
                        second.points = childSnapshot.val();
                    } else if (childSnapshot.val() > third.points || third.name === "") {
                        third.name = childSnapshot.key;
                        third.points = childSnapshot.val();
                    }
                }
            });
            const results = {
                first: first,
                second: second,
                third: third
            };
            return results;
        });
}