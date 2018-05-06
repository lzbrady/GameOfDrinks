import React, {Component} from 'react';

import {redirect, isFullGame} from '../Backend/database';
import {getFate, newCommand} from '../Backend/database-rtd';
import {playWithFate} from '../Backend/database-main';

import './roll-the-dice.css';

class RollTheDice extends Component {
    constructor() {
        super();

        this.state = {
            card: "",
            gameCode: "",
            redirectTo: ""
        }
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
        playWithFate(gameCode, false);

        getFate(gameCode).then((snapshot) => {
            this.setState({card: snapshot});
        });

        // Timer for timer...
        setTimeout(() => {
            redirect(gameCode, `/play/${gameCode}/games/${this.state.redirectTo}`).then((rtn) => {
                newCommand(gameCode);

                setTimeout(() => {
                    redirect(gameCode, false);
                }, 1);
            });
        }, 5000);
    }

    render() {
        return (
            <div className="roll-the-dice">
                <h1 className="game-title">Fate Says...</h1>
                <div className="game-card">
                    <p className="card-content">{this.state.card}</p>
                </div>
            </div>
        )
    }
}

export default RollTheDice;