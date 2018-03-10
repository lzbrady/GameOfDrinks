import fire from './fire';

const childrenSize = 33;

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

export function finishRound(gameCode) {
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