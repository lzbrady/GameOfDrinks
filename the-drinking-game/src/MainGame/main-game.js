import React, {Component} from 'react';

import {redirect} from '../Backend/database';
import {getRoundAndGame} from '../Backend/database-main';

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

            this.startGame();
        });
    }

    startGame() {
        setTimeout(() => {
            redirect(this.state.gameCode, `/play/${this.state.gameCode}/games/${this.state.currentGame}`).then((rtn) => {
                setTimeout(() => {
                    redirect(this.state.gameCode, false);
                }, 1);
            });
        }, 1000);
    }

    render() {
        return (
            <div className="main-game">
                <div className="main-game-content">
                    <p>Round: {this.state.round}</p>
                </div>
            </div>
        )
    }
}

export default MainGame;