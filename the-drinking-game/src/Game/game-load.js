import React, {Component} from 'react';
import fire from '../Backend/fire';
import {removePlayer} from '../Backend/database';
import middlePic from '../Images/middle-icon.png';

import './game-load.css';

class GameLoad extends Component {
    constructor() {
        super();

        this.state = {
            gameCode: "",
            valid: true,
            players: [],
            playerName: ""
        }

        this.startGame = this
            .startGame
            .bind(this);
        this.leaveGame = this
            .leaveGame
            .bind(this);
    }

    startGame() {
        console.log("TODO: Start Game");
    }

    leaveGame() {
        removePlayer(localStorage.getItem("username"), this.state.gameCode);
        this
            .props
            .history
            .push('/');
    }

    componentDidMount() {
        if (this.state.valid && (!localStorage.getItem("username") || localStorage.getItem("username") === "")) {
            this.setState({valid: false});
        }
        this.setState({playerName: this.props.playerName});
        let gameCode = this.props.match.params.String;
        this.setState({gameCode: gameCode});
        let gameRef = fire
            .database()
            .ref('games')
            .child(gameCode);
        gameRef.on('value', (snapshot) => {
            if (snapshot.val() !== null) {
                let newPlayers = [];
                let num = 0;
                snapshot.forEach(function (childSnapshot) {
                    if (num < 8) {
                        newPlayers.push(childSnapshot.key);
                        num++;
                    } else {
                        console.log("TODO: Too many players");
                    }
                });
                this.setState({players: newPlayers});
            } else {
                this.setState({valid: false});
            }
        });
    }

    render() {
        return (
            <div className="game-page">
                <h1>{!this.state.valid
                        ? "Invalid Game Code or Player Name"
                        : ""}</h1>
                <div
                    className={this.state.valid
                    ? "game_load"
                    : "hide"}>
                    <h1>The Drinking Game</h1>
                    <div className="player-list">
                        <img src={middlePic} alt="Logo" className="middle-icon"/>
                        <p className="game-code">{this.state.gameCode}</p>
                        {(this.state.players.map((player, index) => {
                            return <p
                                className={(localStorage.getItem("username") === player
                                ? `a-player-in-list deg${index} my-name`
                                : `a-player-in-list deg${index}`)}
                                key={player}>{player}</p>
                        }))}
                    </div>
                    <button className="start-game-btn" onClick={this.startGame}>Start Game</button>
                    <button className="leave-game-btn" onClick={this.leaveGame}>Leave Game</button>
                </div>
            </div>
        );
    }
}

export default GameLoad;
