import React, {Component} from 'react';
import fire from '../Backend/fire';
import {removePlayer, redirect, isActuallyInGame} from '../Backend/database';
import middlePic from '../Images/middle-icon.png';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";

import './game-load.css';

class GameLoad extends Component {
    constructor() {
        super();

        this.state = {
            gameCode: "",
            valid: true,
            players: [],
            lastAdded: "Going back/forward within the browser will interfere with gameplay, use the site" +
                    "s buttons to navigate!",
            toasting: true
        }

        this.leaveGame = this
            .leaveGame
            .bind(this);

        this.startGame = this
            .startGame
            .bind(this);

        this.displayNameInToast = this
            .displayNameInToast
            .bind(this);
    }

    startGame() {
        redirect(this.state.gameCode, `/play/${this.state.gameCode}/games/`).then((rtn) => {
            setTimeout(() => {
                redirect(this.state.gameCode, false);
            }, 1);
        });
    }

    leaveGame() {
        removePlayer(localStorage.getItem("username"), this.state.gameCode);
        this
            .props
            .history
            .push('/');
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({toasting: false, lastAdded: ""});
        }, 8000);

        console.log("Local storage:", localStorage.getItem("username"));

        let gameCode = this.props.match.params.String;
        if (this.state.valid && (!localStorage.getItem("username") || localStorage.getItem("username") === "")) {
            console.log("HERERERE");
            this.setState({valid: false});
        } else {
            isActuallyInGame(gameCode, localStorage.getItem("username")).then((inGame) => {
                if (!inGame) {
                    this
                        .props
                        .history
                        .push('/');
                }
            });
        }

        this.setState({gameCode: gameCode});
        let gameRef = fire
            .database()
            .ref('games')
            .child(gameCode);
        gameRef.on('value', (snapshot) => {
            if (snapshot.val() !== null) {
                let newPlayers = [];
                let num = 0;
                snapshot.forEach((childSnapshot) => {
                    if (num < 8 && childSnapshot.key !== 'redirect' && childSnapshot.key !== 'metadata' && childSnapshot.key !== 'drinks' && childSnapshot.key !== 'captions') {
                        newPlayers.push(childSnapshot.key);
                        num++;
                    } else if (childSnapshot.key === 'redirect' && childSnapshot.val()) {
                        this
                            .props
                            .history
                            .push(childSnapshot.val());
                    }
                });
                this.setState({players: newPlayers});
            } else {
                this.setState({valid: false});
            }
        });
    }

    displayNameInToast(nameToToast) {
        if (!this.state.toasting) {
            this.setState({toasting: true, lastAdded: nameToToast});
        } else {
            this.setState({lastAdded: nameToToast});
        }
        setTimeout(() => {
            this.setState({toasting: false, lastAdded: ""});
        }, 3000);
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
                    <h1 className="title-font">The Drinking Game</h1>

                    <MobileView device={isMobile}>
                        <div className="player-list-mobile">
                            <img src={middlePic} alt="Logo" className="middle-icon-mobile"/>
                            <p className="game-code-mobile">{this.state.gameCode}</p>
                            <p className="click-circle">*Press a circle for full name</p>
                            {(this.state.players.map((player, index) => {
                                return <p
                                    className={(localStorage.getItem("username") === player
                                    ? `a-player-in-list-mobile deg${index}-mobile my-name`
                                    : `a-player-in-list-mobile deg${index}-mobile`)}
                                    key={player}
                                    onClick={() => this.displayNameInToast(player)}>{player.substring(0, 1)}</p>
                            }))}
                        </div>
                    </MobileView>

                    <BrowserView device={isBrowser}>
                        <div className="player-list-browser">
                            <img src={middlePic} alt="Logo" className="middle-icon-browser"/>
                            <p className="game-code-browser">{this.state.gameCode}</p>
                            {(this.state.players.map((player, index) => {
                                return <p
                                    className={(localStorage.getItem("username") === player
                                    ? `a-player-in-list-browser deg${index}-browser my-name`
                                    : `a-player-in-list-browser deg${index}-browser`)}
                                    key={player}
                                    onClick={() => this.displayNameInToast(player)}>{player}</p>
                            }))}
                        </div>
                    </BrowserView >

                    <p
                        className={this.state.toasting
                        ? "full-name"
                        : "hide"}>{this.state.lastAdded}</p>
                    {/* <Link to='/games' className="link"> */}
                    <button className="start-game-btn" onClick={this.startGame}>Start Game</button>
                    {/* </Link> */}
                    <button className="leave-game-btn" onClick={this.leaveGame}>Leave Game</button>
                </div>
            </div>
        );
    }
}

export default GameLoad;
