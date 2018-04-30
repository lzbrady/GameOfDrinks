import fire from './fire';
import {nhieRandomNumber} from './database-nhie';
import {mltRandomNumber} from './database-mlt';
import {ccRandomNumber} from './database-cc';
import {generateNewTriviaQuestion} from './database-trivia';
import {rtdRandomNumber} from './database-rtd';

// (Index in array + 1) == Round
const gameAtRound = ["never-have-i-ever", "most-likely-to", "caption-contest", "trivia"];
//roll-the-dice

export function getRoundAndGame(gameCode) {
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('isFullGame')
        .set(true);

    return fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('round')
        .once('value')
        .then((snapshot) => {
            return getGame(snapshot.val());
        });
}

function getGame(round) {
    return {
        round: round,
        game: gameAtRound[round - 1]
    };
}

export function nextRound(gameCode, nextRound) {
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('round')
        .set(nextRound);
}

export function finishGame(gameCode) {
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('pointCeremony')
        .set(true);
}

export function reset(gameCode) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode);

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

    // Reset points
    resetPoints(gameCode);
    let rtn = ref
        .child('metadata')
        .child('round')
        .once('value')
        .then((snapshot) => {
            return true;
        });
    return rtn;
}

function resetPoints(gameCode) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode);
    return ref.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            if (childSnapshot.key !== 'redirect' && childSnapshot.key !== 'metadata' && childSnapshot.key !== 'drinks' && childSnapshot.key !== 'captions' && childSnapshot.key !== 'redirect') {
                resetPointsForPlayer(gameCode, childSnapshot.key);
            }
        });
        return snapshot;
    });
}

function resetPointsForPlayer(gameCode, playerName) {
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child(playerName)
        .set(0);
}

export function getRound(gameCode) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('round');
    return ref.once('value').then((snapshot) => {
        return snapshot.val();
    });
}