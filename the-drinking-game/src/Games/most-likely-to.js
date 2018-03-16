import React, {Component} from 'react';

import {playRound} from '../Backend/database-mlt';
import {getPlayers, finishRound} from '../Backend/database';

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
    }

    componentDidMount() {
        let gameCode = this
            .props
            .location
            .pathname
            .substring(6, 11);
        this.setState({gameCode: gameCode});

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
        })
    }

    choosePlayer(player) {
        console.log("Chose", player);
    }

    render() {
        return (
            <div className="most-likely-to">
                <h1>Most Likely To</h1>
                <div
                    className={(this.state.timeLeft < 0 || this.state.timeLeft > 10)
                    ? "hide"
                    : "mlt-card"}>
                    <p className="mlt-content">{this.state.card}</p>
                </div>
                <div
                    className={(this.state.timeLeft < 0 || this.state.timeLeft > 10)
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
            </div>
        )
    }
}

export default MostLikelyTo;