import fire from './fire';

import {getPlayers} from './database';

const childrenSize = 6;

export function getFate(gameCode) {
    return fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('rtd')
        .once('value')
        .then((data) => {
            return getCard(gameCode, data.val());
        });
}

function getCard(gameCode, num) {
    let ref = fire
        .database()
        .ref('commands')
        .child(num);
    return ref
        .once('value')
        .then((snapshot) => {
            if (snapshot.val().includes('[NAME]')) {
                return assignPlayer(gameCode, snapshot.val());
            }
            return snapshot.val();
        });
}

function assignPlayer(gameCode, card) {
    return getPlayers(gameCode).then((snapshot) => {
        if (snapshot.val() !== null) {
            let players = [];
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.key !== 'redirect' && childSnapshot.key !== 'metadata' && childSnapshot.key !== 'drinks' && childSnapshot.key !== 'captions') {
                    players.push(childSnapshot.key);
                }
            });
            let newCard = getRandomPlayer(players) + card.substring(6);
            return newCard;
        }
    });
}

function getRandomPlayer(players) {
    return players[Math.floor(Math.random() * players.length)];
}

export function rtdRandomNumber() {
    return Math.floor(Math.random() * childrenSize);
}

export function newCommand(gameCode) {
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('rtd')
        .set(rtdRandomNumber());
}