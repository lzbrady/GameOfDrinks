import React, {Component} from 'react';

import {redirect} from '../Backend/database';
import {getFate, newCommand} from '../Backend/database-rtd';

import './roll-the-dice.css';

class RollTheDice extends Component {
    constructor() {
        super();

        this.state = {
            card: "",
            gameCode: ""
        }
    }

    componentDidMount() {
        let gameCode = this
            .props
            .location
            .pathname
            .substring(6, 11);
        this.setState({gameCode: gameCode});

        getFate(gameCode).then((snapshot) => {
            this.setState({card: snapshot});
        });

        // Timer for timer...
        setTimeout(() => {
            redirect(gameCode, `/play/${gameCode}/games/`).then((rtn) => {
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
                <div className="roll-the-dice-card">
                    <p className="roll-the-dice-content">{this.state.card}</p>
                </div>
            </div>
        )
    }
}

export default RollTheDice;