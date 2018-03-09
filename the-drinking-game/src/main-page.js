import React, {Component} from 'react';

import {createGame, joinGame} from './Backend/database';
import './main-page.css';

class MainPage extends Component {
    constructor() {
        super();

        this.state = {
            playerName: "",
            gameCode: "",
            error: ""
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

    newGameSubmit(e) {
        if (!e.key || e.key === 'Enter') {
            if (typeof(Storage) !== "undefined") {
                this.setState({error: ""});
                localStorage.setItem("username", this.state.playerName.trim());
                // Must attempt to read to persist
                localStorage.getItem('localKey');
                let code = createGame(this.state.playerName);
                this.setState({error: ""});
                this
                    .props
                    .history
                    .push(`/lobby/${code}`);
            } else {
                console.log("TODO: Oldies who don't have session storage browsers.")
                // Sorry! No Web Storage support..
            }
        }
    }

    joinGameSubmit(event) {
        if (typeof(Storage) !== "undefined") {
            this.setState({error: ""});
            localStorage.setItem("username", this.state.playerName.trim());
            // Must attempt to read to persist
            localStorage.getItem('localKey');
            joinGame(this.state.playerName, this.state.gameCode).then((rtn) => {
                if (rtn.success) {
                    this
                        .props
                        .history
                        .push(`/lobby/${this.state.gameCode}`);
                } else {
                    this.setState(rtn);
                }
            });
        } else {
            console.log("TODO: Oldies who don't have session storage browsers.")
            // Sorry! No Web Storage support..
        }
    }

    render() {
        return (
            <div className="main-page">
                <h1>The Drinking Game</h1>
                <div className="new-game-div">
                    <p className="main-page-label">Name:</p>
                    <input
                        type="text"
                        className="main-page-input"
                        onChange={this.handleChange}
                        onKeyPress={this.newGameSubmit}
                        name="name"
                        placeholder="Player Name"/>
                    <button
                        className={(this.state.playerName === "")
                        ? "main-page-disabled-button"
                        : "main-page-button"}
                        disabled={this.state.playerName === ""}
                        onClick={this.newGameSubmit}>Create Game</button>
                </div>
                <div className="join-game-div">
                    <p className="main-page-label">Game Code:</p>
                    <input
                        type="text"
                        className="main-page-input"
                        onChange={this.gameCodeChange}
                        name="name"
                        placeholder="Game Code (qWlp4)"/>
                    <button
                        className={(this.state.playerName === "" || this.state.gameCode === "")
                        ? "main-page-disabled-button"
                        : "main-page-button"}
                        disabled={this.state.playerName === "" || this.state.gameCode === ""}
                        onClick={this.joinGameSubmit}>Join Game</button>
                </div>
                <p
                    className={this.state.error === ""
                    ? "hide"
                    : "error-message"}>{this.state.error}</p>
            </div>
        );
    }
}

export default MainPage;
