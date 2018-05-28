import fire from './fire';

import {getDrinks, updateDrinks, getPlayers, removeDrinks} from './database';

export function displayPattern(gameCode) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode)
        .child("metadata");

    return ref
        .child("showPattern")
        .once('value')
        .then((snapshot) => {
            if (snapshot.val()) {
                getPlayers(gameCode).then((snapshot) => {
                    if (snapshot.val() !== null) {
                        snapshot.forEach((childSnapshot) => {
                            if (childSnapshot.key !== 'redirect' && childSnapshot.key !== 'metadata' && childSnapshot.key !== 'drinks' && childSnapshot.key !== 'captions') {
                                updateDrinks(gameCode, childSnapshot.key);
                            }
                        });
                    }
                });

                return ref
                    .child("pattern")
                    .once('value')
                    .then((snapshot) => {
                        let digits = ("" + snapshot.val()).split("");
                        return digits;
                    });
            } else {
                return false;
            }
        });

}

export function showPattern(gameCode) {
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child("metadata")
        .child("showPattern")
        .set(true);
}

export function stopPattern(gameCode) {
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child("metadata")
        .child("showPattern")
        .set(false);
}

export function getSaberResults(gameCode, ogTimeLeft) {
    return getDrinks(gameCode).then((snapshot) => {
        fire
            .database()
            .ref('games')
            .child(gameCode)
            .child("metadata")
            .child("showPattern")
            .set(true);

        newPattern(gameCode, ogTimeLeft);

        return snapshot.val();
    })
}

function newPattern(gameCode, ogTimeLeft) {
    fire
        .database()
        .ref('games')
        .child(gameCode)
        .child("metadata")
        .child("pattern")
        .once('value')
        .then((snapshot) => {
            let newPat = 0;
            let oldPat = ("" + snapshot.val()).split("");

            let patternLength = 5;
            if (ogTimeLeft === 25) {
                patternLength += 1;
            } else if (ogTimeLeft === 30) {
                patternLength = 4;
            }
            console.log("TEST", ogTimeLeft);

            for (let i = 0; i < patternLength; i++) {
                newPat += (randomPatternNumber() * (Math.pow(10, i)));
            }
            fire
                .database()
                .ref('games')
                .child(gameCode)
                .child("metadata")
                .child("pattern")
                .set(newPat);
        });
}

function randomPatternNumber() {
    return (Math.floor(Math.random() * 4) + 1);
}

export function checkPath(gameCode, currentPath, lastChosen, username) {
    let ref = fire
        .database()
        .ref('games')
        .child(gameCode)
        .child("metadata")
        .child("pattern");

    return ref
        .once('value')
        .then((snapshot) => {
            let answer = currentPath;
            answer.push(lastChosen);
            let correct = ("" + snapshot.val()).split("");

            if (correct.length < answer.length) {
                // Already got it right, ignore
                return correct.length - answer.length;
            }

            for (let i = 0; i < answer.length; i++) {
                if (("" + answer[i]) !== correct[i]) {
                    answer.length = 0;
                    // Incorrect somewhere
                    return 10;
                }
            }

            // Correct, finished
            if (answer.length === correct.length) {
                removeDrinks(gameCode, localStorage.getItem('username'));
                return 0;
            }

            // Correct, still in progress
            return correct.length - answer.length;
        });
}