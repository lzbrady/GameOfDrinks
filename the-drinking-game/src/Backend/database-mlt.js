import fire from './fire';

const childrenSize = 49;

export function playRound(gameCode) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('mlt')
        .once('value')
        .then((data) => {
            return getCard(gameCode, data.val());
        });
    return ref;
}

function getCard(gameCode, num) {
    let ref = fire
        .database()
        .ref('most-likely-to')
        .child(num);
    return ref
        .once('value')
        .then((snapshot) => {
            fire
                .database()
                .ref('games')
                .child(gameCode)
                .child('metadata')
                .child('mlt')
                .set(mltRandomNumber());
            return snapshot.val();
        });
}

export function mltRandomNumber() {
    return Math.floor(Math.random() * childrenSize);
}