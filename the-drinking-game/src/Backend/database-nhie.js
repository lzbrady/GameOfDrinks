import fire from './fire';

const childrenSize = 33;

export function playRound() {
    let ref = fire
        .database()
        .ref('never-have-i-ever')
        .child(randomNumber());
    return ref
        .once('value')
        .then((snapshot) => {
            return snapshot.val();
        });
}

function randomNumber() {
    return Math.floor(Math.random() * childrenSize);
}