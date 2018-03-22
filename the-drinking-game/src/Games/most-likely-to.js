import React, {Component} from 'react';

import {playRound} from '../Backend/database-mlt';
import {redirect, getPlayers, votePlayer, getMostVoted, resetVotes} from '../Backend/database';

import './most-likely-to.css';

class MostLikelyTo extends Component {
    constructor() {
        super();

        this.state = {
            card: "",
            timeLeft: 10,
            answered: false,
            drinks: [],
            players: [],
            gameCode: ""
        }

        this.choosePlayer = this
            .choosePlayer
            .bind(this);

        this.getVotes = this
            .getVotes
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
            if (this.state.timeLeft === 1) {
                this.getVotes();
            }
            this.setState({
                timeLeft: this.state.timeLeft - 1
            });
        }, 1000);

        resetVotes(gameCode);
        playRound(gameCode).then((card) => {
            this.setState({card: card});
        });

        getPlayers(gameCode).then((snapshot) => {
            if (snapshot.val() !== null) {
                let players = [];
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.key !== 'redirect' && childSnapshot.key !== 'metadata' && childSnapshot.key !== 'drinks') {
                        players.push(childSnapshot.key);
                    }
                });
                this.setState({players: players});
            }
        });

        let i = 0;
        var gameTimer = setInterval(() => {
            if (i >= 2) {
                clearInterval(timer);
                clearInterval(gameTimer);
                redirect(gameCode, `/play/${gameCode}/games/`).then((rtn) => {
                    setTimeout(() => {
                        redirect(gameCode, false);
                    }, 1);
                });
                resetVotes(this.state.gameCode);
            } else {
                playRound(gameCode).then((card) => {
                    this.setState({card: card});
                    this.setState({timeLeft: 10});
                    this.setState({answered: false});
                });
                resetVotes(this.state.gameCode);
            }
            i++;
        }, 14000);
    }

    getVotes() {
        getMostVoted(this.state.gameCode).then((voted) => {
            this.setState({drinks: voted});
        });
    }

    choosePlayer(player) {
        this.setState({answered: true});
        votePlayer(this.state.gameCode, player.player);
    }

    render() {
        return (
            <div className="most-likely-to">
                <h1>Most Likely To</h1>
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
                    : "mlt-card"}>
                    <p className="mlt-content">{this.state.card}</p>
                </div>
                <div
                    className={(this.state.answered)
                    ? "hide"
                    : "mlt-players"}>
                    {this
                        .state
                        .players
                        .map((player) => {
                            return <p
                                onClick={e => this.choosePlayer({player})}
                                key={player}
                                className="mlt-player">{player}</p>;
                        })}
                </div>
                <p
                    className={this.state.answered
                    ? "answer-confirmation"
                    : "hide"}>Answered &#9989;</p>
            </div>
        )
    }
}

export default MostLikelyTo;