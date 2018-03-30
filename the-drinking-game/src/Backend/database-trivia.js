import fire from './fire';
import axios from 'axios';
import {updateDrinks, updateScore, getDrinks} from './database';

const childrenSize = 4;
// General knowledge, music, sports, history
const categories = [9, 12, 21, 23];

export function getTriviaInfo(gameCode) {
    return fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('trivia')
        .once('value')
        .then((json) => {
            let triviaRaw = json.val();

            let triviaObject = {
                question: triviaRaw.question,
                difficulty: triviaRaw.difficulty
            };

            let answers = [triviaRaw.correct_answer];
            for (let key in triviaRaw.incorrect_answers) {
                answers.push(triviaRaw.incorrect_answers[key]);
            }

            shuffle(answers);

            triviaObject.answers = answers;

            return triviaObject;
        });
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j,
        x,
        i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

export function generateNewTriviaQuestion() {
    let category = categories[randomCategory()];
    return axios
        .get('https://opentdb.com/api.php?amount=1&category=' + category)
        .then((response) => {
            return response.data.results[0];
        });
}

export function answerQuestion(gameCode, answer) {
    return fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('trivia')
        .child('correct_answer')
        .once('value')
        .then((snapshot) => {
            if (snapshot.val() === answer) {
                return givePoints(gameCode, 20);
            } else {
                return givePoints(gameCode, 0);
            }
        });

}

function givePoints(gameCode, points) {
    let username = localStorage.getItem('username');
    if (points > 0) {
        fire
            .database()
            .ref('games')
            .child(gameCode)
            .child(username);
        updateScore(username, gameCode, points);
    } else {
        updateDrinks(gameCode, username);
    }
    return "Success";
}

function randomCategory() {
    return Math.floor(Math.random() * childrenSize);
}

export function finishRound(gameCode) {
    // Trivia in JSON form
    return generateNewTriviaQuestion().then((json) => {
        fire
            .database()
            .ref('games')
            .child(gameCode)
            .child('metadata')
            .child('trivia')
            .set(json);
        return getDrinks(gameCode);
    });
}

export function getCorrectAnswer(gameCode) {
    return fire
        .database()
        .ref('games')
        .child(gameCode)
        .child('metadata')
        .child('trivia')
        .child('correct_answer')
        .once('value')
        .then((snapshot) => {
            return snapshot.val();
        });
}