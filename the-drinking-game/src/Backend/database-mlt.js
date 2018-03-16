import fire from './fire';

import {updateDrinks} from './database';

const childrenSize = 5;

export function playRound(gameCode) {
    return fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('mlt')
        .once('value')
        .then((data) => {
            return getCard(data.val());
        });
}

function getCard(num) {
    let ref = fire
        .database()
        .ref('most-likely-to')
        .child(num);
    return ref
        .once('value')
        .then((snapshot) => {
            return snapshot.val();
        });
}

export function finishRound(points, gameCode) {
    if (points > 0) {
        let username = localStorage.getItem('username');
        let ref = fire
            .database()
            .ref('games')
            .child(gameCode)
            .child(username);
        ref
            .once('value')
            .then((snapshot) => {
                updateScore(ref, parseInt(snapshot.val()), points * 20);
            });
        updateDrinks(gameCode, username);
    }

    return fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('nhie')
        .set(mltRandomNumber());
}

function updateScore(ref, oldScore, newScore) {
    ref.set(oldScore + newScore);
}

export function mltRandomNumber() {
    return Math.floor(Math.random() * childrenSize);
}