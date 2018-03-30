import React, {Component} from 'react';

import {redirect, resetValues, getDrinks} from '../Backend/database';
import {getTriviaInfo, answerQuestion, finishRound} from '../Backend/database-trivia';

import './trivia.css';

class Trivia extends Component {
    constructor() {
        super();

        this.state = {
            card: "",
            timeLeft: 10,
            answered: false,
            drinks: [],
            gameCode: "",
            question: "",
            answers: [],
            difficulty: ""
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
            }, ((10000 * (i + 1)) + (4000 * i)));
        }

        // Initial game
        getTriviaInfo(gameCode).then((triviaObject) => {
            this.setState({question: triviaObject.question, answers: triviaObject.answers, difficulty: triviaObject.difficulty});
        });

        // Timer to fetch a new question every 14 seconds
        var gameTimer = setInterval(() => {
            if (i >= 2) {
                clearInterval(timer);
                clearInterval(scoreTimer);
                clearInterval(gameTimer);
                resetValues(gameCode, 'drinks');
                redirect(gameCode, `/play/${gameCode}/games/`).then((rtn) => {
                    setTimeout(() => {
                        redirect(gameCode, false);
                    }, 1);
                });
            } else {
                resetValues(gameCode, 'drinks');
                getTriviaInfo(gameCode).then((triviaObject) => {
                    this.setState({question: triviaObject.question, answers: triviaObject.answers, difficulty: triviaObject.difficulty});
                    this.setState({timeLeft: 10});
                    this.setState({answered: false});
                });
            }
            i++;
        }, 14000);
    }

    refreshScores() {
        finishRound(this.state.gameCode).then((snapshot) => {
            let scores = [];
            for (let key in snapshot.val()) {
                if (snapshot.val().hasOwnProperty(key) && snapshot.val()[key]) {
                    scores.push(key);
                }
            }
            this.setState({drinks: scores});
        });
    }

    createMarkup() {
        return {__html: this.state.question};
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
                    className={(this.state.timeLeft < 0 || this.state.timeLeft > 10)
                    ? "hide"
                    : "timer-text"}>{this.state.timeLeft}</h3>
                <div
                    className={(this.state.timeLeft < 0 || this.state.timeLeft > 10)
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
                    className={(this.state.timeLeft >= 0 && this.state.timeLeft <= 10)
                    ? "trivia-card"
                    : "hide"}>
                    <p className="trivia-question" dangerouslySetInnerHTML={this.createMarkup()}/>
                    <div
                        className={this.state.answered
                        ? "hide"
                        : ""}>
                        {this
                            .state
                            .answers
                            .map((answer) => {
                                return <p className="trivia-answer" key={answer} onClick={e => this.answer(answer)}>{answer}</p>;
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