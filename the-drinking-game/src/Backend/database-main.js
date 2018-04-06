import fire from './fire';

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