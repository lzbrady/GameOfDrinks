import fire from './fire';

import {votePlayer} from './database';

const childrenSize = 4;

export function playRound(gameCode) {
    return fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('cc')
        .once('value')
        .then((data) => {
            return getCard(data.val());
        });
}

function getCard(num) {
    let ref = fire
        .database()
        .ref('caption-contest')
        .child(num);
    return ref
        .once('value')
        .then((snapshot) => {
            return getImage(snapshot.val());
        });
}

function getImage(storageKey) {
    let ref = fire
        .storage()
        .ref('caption-contest');
    let promise = ref
        .child(storageKey)
        .getDownloadURL();
    return promise.then((url) => {
        return url;
    });
}

export function submitCaption(caption, gameCode) {
    let username = localStorage.getItem('username');
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode);

    ref
        .child('captions')
        .child('No One')
        .set(false);

    return ref
        .child('captions')
        .child(caption)
        .set(username);
}

export function getAllCaptions(gameCode) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('captions');

    return ref
        .once('value')
        .then((snapshot) => {
            return snapshot.val();
        });
}

export function submitVote(caption, gameCode) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode);

    return ref
        .child('captions')
        .child(caption)
        .once('value')
        .then((snapshot) => {
            votePlayer(gameCode, snapshot.val());
        });
}

export function getWinningCaption(gameCode, username) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('captions');

    return ref
        .once('value')
        .then((snapshot) => {
            if (snapshot.val() !== null) {
                let cap = "Could not find caption";
                snapshot.forEach((childSnapshot) => {
                    console.log("val", childSnapshot.val());
                    console.log("key", childSnapshot.key);
                    console.log("Username", username);
                    if (childSnapshot.val() === username) {
                        console.log("Matched");
                        cap = childSnapshot.key;
                    }
                });
                console.log("Cap", cap);
                return cap;
            } else {
                return "Could not find caption";
            }
        });
}

export function ccRandomNumber() {
    return Math.floor(Math.random() * childrenSize);
}