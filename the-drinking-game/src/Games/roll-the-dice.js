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
            redirectTo: "",
            showFate: false
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

        getFate(gameCode).then((snapshot) => {
            this.setState({card: snapshot});
        });

        setTimeout(() => {
            this.setState({showFate: true});
        }, 3000);

        setTimeout(() => {
            playWithFate(gameCode, false);
        }, 5000);

        // Timer for timer...
        setTimeout(() => {
            redirect(gameCode, `/play/${gameCode}/games/${this.state.redirectTo}`).then((rtn) => {
                newCommand(gameCode);

                setTimeout(() => {
                    redirect(gameCode, false);
                }, 1);
            });
        }, 8000);
    }

    render() {
        return (
            <div className="roll-the-dice">
                <h1
                    className={this.state.showFate
                    ? "hide"
                    : "fate-title"}>Fate Says...</h1>
                <div
                    className={this.state.showFate
                    ? "game-card"
                    : "hide"}>
                    <p className="card-content">{this.state.card}</p>
                </div>
            </div>
        )
    }
}

export default RollTheDice;