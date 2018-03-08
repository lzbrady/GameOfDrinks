import React, {Component} from 'react';
import {Link} from "react-router-dom";

import {createGame, joinGame} from './Backend/database';

class MainPage extends Component {
    constructor() {
        super();

        this.state = {
            playerName: "",
            gameCode: ""
        }

        this.handleChange = this
            .handleChange
            .bind(this);
        this.gameCodeChange = this
            .gameCodeChange
            .bind(this);
        this.newGameSubmit = this
            .newGameSubmit
            .bind(this);
        this.joinGameSubmit = this
            .joinGameSubmit
            .bind(this);
    }

    handleChange(event) {
        this.setState({playerName: event.target.value});
    }

    gameCodeChange(event) {
        this.setState({gameCode: event.target.value});
    }

    newGameSubmit(event) {
        let code = createGame(this.state.playerName);
        this
            .props
            .history
            .push(`/lobby/${code}`);
    }

    joinGameSubmit(event) {
        joinGame(this.state.playerName, this.state.gameCode);
        this
            .props
            .history
            .push(`/lobby/${this.state.gameCode}`);
    }

    render() {
        return (
            <div className="main-page">
                <h1>The Drinking Game</h1>
                <label>
                    Name:
                    <input
                        type="text"
                        onChange={this.handleChange}
                        name="name"
                        placeholder="Player Name"/>
                </label>
                <button disabled={this.state.playerName === ""} onClick={this.newGameSubmit}>Create Game</button>
                <label>
                    Game Code:
                    <input
                        type="text"
                        onChange={this.gameCodeChange}
                        name="name"
                        placeholder="Game Code (qWlp4)"/>
                </label>
                <button
                    disabled={this.state.playerName === "" || this.state.gameCode === ""}
                    onClick={this.joinGameSubmit}>Join Game</button>
            </div>
        );
    }
}

export default MainPage;
