import React, {Component} from 'react';

import {redirect, resetValues, isFullGame} from '../Backend/database';
import {getTriviaInfo, answerQuestion, finishRound, getCorrectAnswer} from '../Backend/database-trivia';
import {nextRound} from '../Backend/database-main';

import './trivia.css';

class Trivia extends Component {
    constructor() {
        super();

        this.state = {
            card: "",
            timeLeft: 15,
            answered: false,
            drinks: [],
            gameCode: "",
            question: "",
            answers: [],
            difficulty: "",
            correctAnswer: "",
            redirectTo: ""
        }

        this.createMarkup = this
            .createMarkup
            .bind(this);

        this.answer = this
            .answer
            .bind(this);

        this.refreshScores = this
            .refreshScores
            .bind(this);
    }

    componentDidMount() {
        let gameCode = this
            .props
            .location
            .pathname
            .substring(6, 11);
        this.setState({gameCode: gameCode});

        isFullGame(gameCode).then((isFullGame) => {
            if (isFullGame) {
                this.setState({redirectTo: 'main-game'});
            }
        });
        nextRound(gameCode, 5);

        // Timer for timer...
        var timer = setInterval(() => {
            this.setState({
                timeLeft: this.state.timeLeft - 1
            });
        }, 1000);

        // Timer to refresh the scores, i = round we are on
        let i = 0;
        for (let i = 0; i < 3; i++) {
            var scoreTimer = setTimeout(() => {
                this.refreshScores();
            }, ((15000 * (i + 1)) + (4000 * i)));

            var correctAnswerTimer = setTimeout(() => {
                getCorrectAnswer(gameCode).then((snapshot) => {
                    this.setState({correctAnswer: snapshot});
                });
            }, (13000 * (i + 1)));
        }

        // Initial game
        getTriviaInfo(gameCode).then((triviaObject) => {
            this.setState({question: triviaObject.question, answers: triviaObject.answers, difficulty: triviaObject.difficulty});
        });

        // Timer to fetch a new question every 19 seconds
        var gameTimer = setInterval(() => {
            if (i >= 2) {
                clearInterval(timer);
                clearTimeout(scoreTimer);
                clearInterval(gameTimer);
                clearTimeout(correctAnswerTimer);
                resetValues(gameCode, 'drinks');
                redirect(gameCode, `/play/${gameCode}/games/${this.state.redirectTo}`).then((rtn) => {
                    setTimeout(() => {
                        redirect(gameCode, false);
                    }, 1);
                });
            } else {
                resetValues(gameCode, 'drinks');
                getTriviaInfo(gameCode).then((triviaObject) => {
                    this.setState({question: triviaObject.question, answers: triviaObject.answers, difficulty: triviaObject.difficulty});
                    this.setState({timeLeft: 15});
                    this.setState({answered: false});
                });
            }
            i++;
        }, 19000);
    }

    refreshScores() {
        finishRound(this.state.gameCode).then((snapshot) => {
            let scores = [];
            for (let key in snapshot.val()) {
                if (snapshot.val().hasOwnProperty(key) && snapshot.val()[key]) {
                    scores.push(key);
                }
            }
            if (scores.includes("No One")) {
                this.setState({drinks: ["Everyone"]});
            } else {
                this.setState({drinks: scores});
            }
        });
    }

    createMarkup(toMark) {
        return {__html: toMark};
    }

    answer(answer) {
        answerQuestion(this.state.gameCode, answer).then(() => {
            this.setState({answered: true});
        });
    }

    render() {
        return (
            <div className="trivia">
                <h1 className="game-title">Trivia</h1>

                <h3
                    className={(this.state.timeLeft < 0 || this.state.timeLeft > 15)
                    ? "hide"
                    : "timer-text"}>{this.state.timeLeft}</h3>

                <div
                    className={(this.state.timeLeft < 0 || this.state.timeLeft > 15)
                    ? "trivia-correct-answer"
                    : "hide"}>Correct Answer:
                    <br/><p dangerouslySetInnerHTML={this.createMarkup(this.state.correctAnswer)}/></div>

                <div
                    className={(this.state.timeLeft < 0 || this.state.timeLeft > 15)
                    ? "drink-table"
                    : "hide"}>
                    <h1>Drink:</h1>
                    {this
                        .state
                        .drinks
                        .map((player) => {
                            return <h3 className="drink-table-person" key={player}>{player}</h3>;
                        })}
                </div>

                <div
                    className={(this.state.timeLeft >= 0 && this.state.timeLeft <= 15)
                    ? "trivia-card"
                    : "hide"}>
                    <p
                        className="trivia-question"
                        dangerouslySetInnerHTML={this.createMarkup(this.state.question)}/>
                    <div
                        className={this.state.answered
                        ? "hide"
                        : ""}>
                        {this
                            .state
                            .answers
                            .map((answer) => {
                                return <p
                                    className="game-answer"
                                    key={answer}
                                    onClick={e => this.answer(answer)}
                                    dangerouslySetInnerHTML={this.createMarkup(answer)}/>;
                            })}
                    </div>

                    <div
                        className={this.state.answered
                        ? "answer-confirmation"
                        : "hide"}>Answered
                        <span aria-labelledby="jsx-a11y/accessible-emoji" role="img">&#9989;</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default Trivia;