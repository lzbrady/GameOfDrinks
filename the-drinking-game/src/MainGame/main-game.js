import React, {Component} from 'react';

import {redirect} from '../Backend/database';
import {getRoundAndGame} from '../Backend/database-main';

import './main-game.css';

class MainGame extends Component {
    constructor() {
        super();

        this.state = {
            gameCode: "",
            round: 1,
            currentGame: ""
        }

        this.startGame = this
            .startGame
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
        });
    }

    startGame() {
        redirect(this.state.gameCode, `/play/${this.state.gameCode}/games/${this.state.currentGame}`).then((rtn) => {
            setTimeout(() => {
                redirect(this.state.gameCode, false);
            }, 1);
        });
    }

    render() {
        return (
            <div className="main-game">
                <div className="main-game-content">

                    <div className="round-table">
                        <div className="round-table-row">
                            <p className="round-table-entry">Round</p>
                            <p className="round-table-entry">Game</p>
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

                    <button className="game-answer" onClick={this.startGame}>Start Round</button>
                </div>
            </div>
        )
    }
}

export default MainGame;