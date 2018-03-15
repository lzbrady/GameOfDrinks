import React, {Component} from 'react';

import {playRound, finishRound} from '../Backend/database-nhie';
import {redirect, resetDrinks, getDrinks} from '../Backend/database';

import './never-have-i-ever.css';

class NeverHaveIEver extends Component {
    constructor() {
        super();

        this.state = {
            card: "",
            timeLeft: 10,
            answered: false,
            drinks: [],
            gameCode: ""
        }

        this.finish = this
            .finish
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

        var timer = setInterval(() => {
            this.setState({
                timeLeft: this.state.timeLeft - 1
            });
        }, 1000);

        var scoreTimer = setInterval(() => {
            this.refreshScores();
        }, 10000);

        playRound(gameCode).then((card) => {
            this.setState({card: card});
        });

        let i = 0;
        var gameTimer = setInterval(() => {
            if (i >= 2) {
                clearInterval(timer);
                clearInterval(gameTimer);
                resetDrinks(gameCode);
                redirect(gameCode, `/play/${gameCode}/games/`).then((rtn) => {
                    setTimeout(() => {
                        redirect(gameCode, false);
                    }, 1);
                });
            } else {
                resetDrinks(gameCode);
                playRound(gameCode).then((card) => {
                    this.setState({card: card});
                    this.setState({timeLeft: 10});
                    this.setState({answered: false});
                });
            }
            i++;
        }, 14000);
    }

    refreshScores() {
        getDrinks(this.state.gameCode).then((snapshot) => {
            let scores = [];
            for (let key in snapshot.val()) {
                console.log("Val", snapshot.val()[key]);
                if (snapshot.val().hasOwnProperty(key) && snapshot.val()[key]) {
                    scores.push(key);
                }
            }
            this.setState({drinks: scores});
        });
    }

    finish(answer) {
        let gameCode = this
            .props
            .location
            .pathname
            .substring(6, 11);

        finishRound(answer, gameCode).then(() => {
            this.setState({answered: true});
        });
    }

    render() {
        return (
            <div className="never-have-i-ever">
                <h1>Never Have I Ever</h1>
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
                    className={(this.state.timeLeft < 0 || this.state.timeLeft > 10)
                    ? "hide"
                    : "nhie-card"}>
                    <h3>Drink if you have...</h3>
                    <p className="nhie-content">{this.state.card}</p>
                    <p className="nhie-catch">*If nobody has, then everybody drinks</p>
                </div>
                <p
                    className={this.state.answered
                    ? "answer-confirmation"
                    : "hide"}>Answered &#9989;</p>
                <button
                    className={this.state.answered
                    ? "hide"
                    : "game-answer"}
                    onClick={e => this.finish(1)}>Yes</button>
                <button
                    className={this.state.answered
                    ? "hide"
                    : "game-answer"}
                    onClick={e => this.finish(0)}>No</button>
            </div>
        );
    }
}

export default NeverHaveIEver;
