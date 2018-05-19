import fire from './fire';

import {getDrinks} from './database';

export function displayPattern(gameCode) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode);

    return ref
        .once('value')
        .then((snapshot) => {
            return [4, 1, 2, 3, 4];
        });
}

export function getSaberResults(gameCode) {
    return getDrinks(gameCode).then((snapshot) => {
        return snapshot.val();
    })
}

export function checkPath(gameCode, currentPath, lastChosen) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode);

    return ref
        .once('value')
        .then((snapshot) => {
            let answer = currentPath;
            answer.push(lastChosen);

            let correct = [4, 1, 2, 3, 4];

            if (correct.length !== answer.length) {
                return correct.length - answer.length;
            }

            for (let i = 0; i < correct.length; i++) {
                if (answer[i] !== correct[i]) {
                    answer.length = 0;
                    return 10;
                }
            }

            return 0;
        });
}