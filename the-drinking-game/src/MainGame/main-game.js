import React, {Component} from 'react';

import {redirect, getResults} from '../Backend/database';
import {getRoundAndGame, finishGame, reset, getRound} from '../Backend/database-main';
import fire from '../Backend/fire';

import './main-game.css';

function PointCeremony(props) {
    return (
        <div className="point-ceremony">
            <div className="podium-div">
                <p className="podium-name">{props.second.name}</p>
                <div className="podium-slot podium-slot-2">2nd</div>
                <p className="podium-name">{props.second.points}</p>
            </div>
            <div className="podium-div">
                <p className="podium-name">{props.first.name}</p>
                <div className="podium-slot podium-slot-1">1st</div>
                <p className="podium-name">{props.first.points}</p>
            </div>
            <div className="podium-div">
                <p className="podium-name">{props.third.name}</p>
                <div className="podium-slot podium-slot-3">3rd</div>
                <p className="podium-name">{props.third.points}</p>
            </div>
            <button onClick={props.endGame} className="game-answer">
                Done
            </button>
        </div>

    );
}

class MainGame extends Component {
    constructor() {
        super();

        this.state = {
            gameCode: "",
            round: 1,
            currentGame: "",
            finished: false,
            first: {},
            second: {},
            third: {}
        }

        this.startGame = this
            .startGame
            .bind(this);

        this.endGame = this
            .endGame
            .bind(this);
    }

    componentDidMount() {
        let gameCode = this
            .props
            .location
            .pathname
            .substring(6, 11);
        this.setState({gameCode: gameCode});

        getRoundAndGame(gameCode).then((snapshot) => {
            this.setState({round: snapshot.round, currentGame: snapshot.game});

            if (snapshot.round != 1) {
                redirect(this.state.gameCode, `/play/${this.state.gameCode}/games/roll-the-dice`).then((rtn) => {
                    setTimeout(() => {
                        redirect(this.state.gameCode, false);
                    }, 1);
                });
            }
        });

        // Listener for if point ceremony should be played
        fire
            .database()
            .ref('games')
            .child(gameCode)
            .child('metadata')
            .child('pointCeremony')
            .on('value', (snapshot) => {
                if (snapshot.val()) {
                    this.setState({finished: true});
                    getResults(this.state.gameCode).then((results) => {
                        this.setState({first: results.first, second: results.second, third: results.third})
                    });
                } else {
                    this.setState({finished: false});
                    getRound(gameCode).then((dbRound) => {
                        if (this.state.round !== dbRound && dbRound === 1) {
                            window
                                .location
                                .reload(true);
                        }
                    })
                }
            });
    }

    startGame() {
        if (this.state.round === 5) {
            finishGame(this.state.gameCode);
            this.setState({finished: true});
        } else {
            redirect(this.state.gameCode, `/play/${this.state.gameCode}/games/${this.state.currentGame}`).then((rtn) => {
                setTimeout(() => {
                    redirect(this.state.gameCode, false);
                }, 1);
            });
        }
    }

    endGame() {
        reset(this.state.gameCode).then((snapshot) => {
            window
                .location
                .reload(true);
        });
    }

    render() {
        return (
            <div className="main-game">

                {this.state.finished && <PointCeremony
                    first={this.state.first}
                    second={this.state.second}
                    third={this.state.third}
                    endGame={this.endGame}/>}

                {!this.state.finished && <div className="main-game-content">

                    <div className="round-table">
                        <div className="round-table-row">
                            <p className="round-table-entry round-heading">Round</p>
                            <p className="round-table-entry game-heading">Game</p>
                        </div>

                        <div
                            className={this.state.round === 1
                            ? "round-table-row current-row"
                            : "round-table-row"}>
                            <p className="round-table-entry-round">1</p>
                            <p className="round-table-entry">Never Have I Ever</p>
                        </div>
                        <div
                            className={this.state.round === 2
                            ? "round-table-row current-row"
                            : "round-table-row"}>
                            <p className="round-table-entry-round">2</p>
                            <p className="round-table-entry">Most Likely</p>
                        </div>
                        <div
                            className={this.state.round === 3
                            ? "round-table-row current-row"
                            : "round-table-row"}>
                            <p className="round-table-entry-round">3</p>
                            <p className="round-table-entry">Caption Contest</p>
                        </div>
                        <div
                            className={this.state.round === 4
                            ? "round-table-row current-row"
                            : "round-table-row"}>
                            <p className="round-table-entry-round">4</p>
                            <p className="round-table-entry">Trivia</p>
                        </div>
                        <div
                            className={this.state.round === 5
                            ? "round-table-row current-row"
                            : "round-table-row"}>
                            <p className="round-table-entry-round">5</p>
                            <p className="round-table-entry">Point Ceremony</p>
                        </div>
                    </div>

                    <button className="game-answer" onClick={this.startGame}>{this.state.round === 5
                            ? "Finish Game"
                            : "Start Round"}</button>
                </div>}
            </div>
        )
    }
}

export default MainGame;