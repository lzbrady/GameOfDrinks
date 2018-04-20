import React, {Component} from 'react';

import {redirect, resetValues, getMostVoted, resetVotes, isFullGame} from '../Backend/database';
import {playRound, submitCaption, getAllCaptions, submitVote, getWinningCaption} from '../Backend/database-cc';
import {nextRound} from '../Backend/database-main';

import './caption-contest.css';

class CaptionContest extends Component {
    constructor() {
        super();

        this.state = {
            url: "",
            timeLeft: 15,
            answered: false,
            drinks: [],
            players: [],
            gameCode: "",
            caption: "",
            captions: [],
            voted: false,
            votable: true
        }

        this.submitAnswer = this
            .submitAnswer
            .bind(this);

        this.handleChange = this
            .handleChange
            .bind(this);

        this.processCaptions = this
            .processCaptions
            .bind(this);

        this.voteCaption = this
            .voteCaption
            .bind(this);

        this.getWinner = this
            .getWinner
            .bind(this);
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
        nextRound(gameCode, 4);

        var timer = setInterval(() => {
            this.setState({
                timeLeft: this.state.timeLeft - 1
            });
        }, 1000);

        playRound(gameCode).then((url) => {
            resetVotes(gameCode);
            this.setState({url: url});
        });

        setTimeout(() => {
            this.processCaptions();
        }, 16000);

        setTimeout(() => {
            this.getWinner();
        }, 26000);

        setTimeout(() => {
            clearInterval(timer);
            resetValues(gameCode, 'captions');
            resetVotes(gameCode);
            this.setState({caption: ""});
            redirect(gameCode, `/play/${gameCode}/games/${this.state.redirectTo}`).then((rtn) => {
                setTimeout(() => {
                    redirect(gameCode, false);
                }, 1);
            });
        }, 30000);
    }

    processCaptions() {
        getAllCaptions(this.state.gameCode).then((snapshot) => {
            let captions = [];
            for (let key in snapshot) {
                if (snapshot.hasOwnProperty(key) && snapshot[key]) {
                    if (key === "No One") {
                        this.setState({votable: false});

                        setTimeout(() => {
                            redirect(this.state.gameCode, `/play/${this.state.gameCode}/games/`).then((rtn) => {
                                setTimeout(() => {
                                    redirect(this.state.gameCode, false);
                                }, 1);
                            });
                        }, 4000);
                    } else {
                        if (this.state.caption !== snapshot[key]) {
                            captions.push(snapshot[key]);
                        }
                    }
                }
            }
            this.setState({captions: captions});
        });
    }

    getWinner() {
        getMostVoted(this.state.gameCode).then((voted) => {
            for (let i = 0; i < voted.length; i++) {
                getWinningCaption(this.state.gameCode, voted[i]).then((caption) => {
                    let cap = {
                        player: voted[i],
                        caption: caption
                    };
                    let oldDrinks = this.state.drinks;
                    oldDrinks.push(cap);
                    this.setState({drinks: oldDrinks});
                });
            }
        });
    }

    submitAnswer() {
        submitCaption(this.state.caption, this.state.gameCode).then(() => {
            this.setState({answered: true});
        });
    }

    handleChange(event) {
        this.setState({caption: event.target.value});
    }

    voteCaption(caption) {
        this.setState({voted: true});
        submitVote(caption.caption, this.state.gameCode);
    }

    render() {
        return (
            <div className="caption-contest">
                <h1 className="game-title">Caption Contest</h1>
                <h3
                    className={(this.state.timeLeft < 0 || this.state.timeLeft > 15)
                    ? "hide"
                    : "timer-text"}>{this.state.timeLeft}</h3>
                <h3
                    className={(this.state.timeLeft < -10 || this.state.timeLeft > -1)
                    ? "hide"
                    : "timer-text"}>{!this.state.votable
                        ? ""
                        : (this.state.timeLeft + 10)}</h3>

                <div
                    className={(this.state.timeLeft < -10)
                    ? "drink-table"
                    : "hide"}>
                    <h1>Drink:</h1>
                    {this
                        .state
                        .drinks
                        .map((player) => {
                            return <h3 className="drink-table-person" key={player.player}>{player.player}
                                <span className="drink-table-person-info">{player.caption}</span>
                            </h3>;
                        })}
                </div>

                <h3
                    className={this.state.votable
                    ? "hide"
                    : "error-message"}>No captions submitted...everyone drink!</h3>

                <div
                    className={(this.state.timeLeft > -10)
                    ? "cc-card"
                    : "hide"}>
                    <p className="cc-content">
                        <img className="cc-picture" src={this.state.url} alt="Loading..."/>
                    </p>
                    <textarea
                        onChange={this.handleChange}
                        className={(this.state.answered || (this.state.timeLeft < 0 || this.state.timeLeft > 15))
                        ? "hide"
                        : "cc-input"}
                        value={this.state.caption || ""}
                        placeholder="Caption this picture!"></textarea>
                    <button
                        className={(this.state.answered || (this.state.timeLeft < 0 || this.state.timeLeft > 15))
                        ? "hide"
                        : "game-answer"}
                        onClick={this.submitAnswer}>Submit</button>
                    <p
                        className={(this.state.answered && this.state.timeLeft > 0)
                        ? "answer-confirmation"
                        : "hide"}>Answered
                        <span aria-labelledby="jsx-a11y/accessible-emoji" role="img">&#9989;</span>
                    </p>

                    <p
                        className={(this.state.timeLeft > -10 && this.state.timeLeft < 0 && this.state.voted)
                        ? "answer-confirmation"
                        : "hide"}>Answered
                        <span aria-labelledby="jsx-a11y/accessible-emoji" role="img">&#9989;</span>
                    </p>
                    <div
                        className={((this.state.timeLeft < 0 || this.state.timeLeft > 15) && !this.state.voted && this.state.votable)
                        ? "captions"
                        : "hide"}>
                        <h3
                            className={this.state.captions.length === 0
                            ? "error-message"
                            : "hide"}>No one else submitted a caption, take a drink on us bud.</h3>
                        {this
                            .state
                            .captions
                            .map((caption, index) => {
                                return <h3 onClick={e => this.voteCaption({caption})} className="caption" key={index}>{caption}</h3>;
                            })}
                    </div>
                </div>
            </div>
        )
    }
}

export default CaptionContest;