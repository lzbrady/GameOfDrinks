import fire from './fire';

import {updateDrinks, updateScore} from './database';

const childrenSize = 51;

export function playRound(gameCode) {
    return fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('nhie')
        .once('value')
        .then((data) => {
            return getCard(data.val());
        });
}

function getCard(num) {
    let ref = fire
        .database()
        .ref('never-have-i-ever')
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
        fire
            .database()
            .ref('games')
            .child(gameCode)
            .child(username);
        updateScore(username, gameCode, points * 20);
        updateDrinks(gameCode, username);
    }

    return fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('nhie')
        .set(nhieRandomNumber());
}

export function nhieRandomNumber() {
    return Math.floor(Math.random() * childrenSize);
}