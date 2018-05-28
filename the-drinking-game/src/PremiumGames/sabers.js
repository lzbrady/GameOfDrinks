import React, {Component} from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

import {redirect, isFullGame, resetValues} from '../Backend/database';
import {displayPattern, checkPath, getSaberResults, stopPattern} from '../Backend/database-sabers';

import './sabers.css';

class Sabers extends Component {
    constructor() {
        super();

        this.state = {
            gameCode: "",
            redirectTo: "",
            showBlade1: false,
            showBlade2: false,
            showBlade3: false,
            showBlade4: false,
            bgColor: "#fcfcfcde",
            chosenPath: [],
            allowClicks: false,
            result: "You Have Not Finished Yet Fam",
            showResult: false,
            timeLeft: 20,
            ogTimeLeft: 20,
            drinks: []
        }

        this.toggleLightSaber = this
            .toggleLightSaber
            .bind(this);
        this.getResults = this
            .getResults
            .bind(this);
        this.setupGame = this
            .setupGame
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

        this.setupGame(gameCode);

        var timer = setInterval(() => {
            if (this.state.timeLeft === 0) {
                console.log("Get drinks");
                this.getResults();
            }
            this.setState({
                timeLeft: this.state.timeLeft - 1
            });
        }, 1000);

        for (let i = 0; i < 3; i++) {
            // 20, 25, 30 sec round times, 12 sec drink table times (really 11)
            let timeOutTime = 32000;
            if (i === 1) {
                timeOutTime = 69000;
            } else if (i === 2) {
                timeOutTime = 111000;
            }

            setTimeout(() => {
                console.log("In Timeout");
                if (i >= 2) {
                    clearInterval(timer);
                    resetValues(gameCode, 'drinks');
                    redirect(gameCode, `/play/${gameCode}/games/${this.state.redirectTo}`).then((rtn) => {
                        setTimeout(() => {
                            redirect(gameCode, false);
                        }, 1);
                    });
                } else {
                    resetValues(gameCode, 'drinks');
                    this.setupGame(gameCode);
                    this.setState({
                        timeLeft: (20 + ((i + 1) * 5)),
                        ogTimeLeft: (20 + ((i + 1) * 5))
                    });
                }
            }, timeOutTime);
        }
    }

    setupGame(gameCode) {
        // Add one second timeout in beginning to make sure you dont miss the pattern
        setTimeout(() => {
            displayPattern(gameCode).then((pattern) => {
                this.setState({showBlade1: false, showBlade2: false, showBlade3: false, showBlade4: false, showResult: false});
                let newPath = this.state.chosenPath;
                newPath.length = 0;
                this.setState({chosenPath: newPath});

                if (pattern) {
                    console.log("Pattern", pattern);
                    for (let i = 0; i <= pattern.length; i++) {
                        // This is to make them flash grey first
                        setTimeout(() => {
                            this.setState({bgColor: "#fcfcfcde"});
                        }, 800 * i + (200 * (i - 1)));

                        // This loops through the actual colors
                        setTimeout(() => {
                            let newColor = "#fcfcfcde";
                            switch (pattern[i]) {
                                case "1":
                                    newColor = "green";
                                    break;
                                case "2":
                                    newColor = "blue";
                                    break;
                                case "3":
                                    newColor = "purple";
                                    break;
                                case "4":
                                    newColor = "red";
                                    break;
                                default:
                                    this.setState({allowClicks: true});

                                    // Leave one second for network speed
                                    setTimeout(() => {
                                        stopPattern(gameCode);
                                    }, 1000);
                                    break;
                            }
                            this.setState({bgColor: newColor});
                        }, 1000 * i);
                    }
                } else {
                    this.setState({allowClicks: true});
                }
            });
        }, 1000);
    }

    getResults() {
        getSaberResults(this.state.gameCode, this.state.ogTimeLeft).then((results) => {
            console.log("Results", results);
            this.setState({showBlade1: false, showBlade2: false, showBlade3: false, showBlade4: false, showResult: false});
            let newPath = this.state.chosenPath;
            newPath.length = 0;
            this.setState({chosenPath: newPath});

            let scores = [];
            for (let key in results) {
                if (results.hasOwnProperty(key) && results[key]) {
                    scores.push(key);
                }
            }
            if (scores.length === 0) {
                this.setState({drinks: ["Everyone!"]});
            } else {
                this.setState({drinks: scores});
            }
        });
    }

    toggleLightSaber(saber_number) {
        if (this.state.allowClicks) {
            checkPath(this.state.gameCode, this.state.chosenPath, saber_number).then((result) => {
                if (result === 0) {
                    this.setState({showBlade1: false, showBlade2: false, showBlade3: false, showBlade4: false, result: "Correct!"});

                    setTimeout(() => {
                        this.setState({showBlade1: true, showBlade2: true, showBlade3: true, showBlade4: true, showResult: true});
                    }, 1000);
                } else if (result === 10) {
                    this.setState({showBlade1: false, showBlade2: false, showBlade3: false, showBlade4: false, result: "Wrong!"});

                    setTimeout(() => {
                        this.setState({showResult: true});
                    }, 500);
                } else if (result < 0) {} else {
                    this.setState({showResult: false});
                }
            });

            switch (saber_number) {
                case 1:
                    this.setState({
                        showBlade1: !this.state.showBlade1
                    });
                    break;
                case 2:
                    this.setState({
                        showBlade2: !this.state.showBlade2
                    });
                    break;
                case 3:
                    this.setState({
                        showBlade3: !this.state.showBlade3
                    });
                    break;
                case 4:
                    this.setState({
                        showBlade4: !this.state.showBlade4
                    });
                    break;
                default:
                    break;
            }
        }
    }

    render() {
        return (
            <div className="sabers">
                <h1 className="game-title">Sabers</h1>
                <h3
                    className={(this.state.timeLeft < 0 || this.state.timeLeft > 30)
                    ? "hide"
                    : "timer-text"}>{this.state.timeLeft}</h3>
                <h3
                    className={this.state.timeLeft > -1
                    ? "hide"
                    : "timer-text"}>{this.state.timeLeft + 12}</h3>
                <div
                    className={(this.state.timeLeft < 0)
                    ? "drink-table"
                    : "hide"}>
                    <h1>Drink:</h1>
                    {this
                        .state
                        .drinks
                        .map((player) => {
                            return <h3 className="drink-table-person" key={player}>{player}</h3>;
                        })}
                </div>

                {(this.state.timeLeft >= 0) && <div
                    className="all-sabers-container"
                    style={{
                    backgroundColor: this.state.bgColor
                }}>
                    {this.state.showResult && <p className="sabers-result">{this.state.result}</p>}

                    <div className="saber-container" id="saber-1">
                        <CSSTransitionGroup
                            transitionName="slide_in"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={500}>
                            {this.state.showBlade1 && <div key="saber-blade" id="blade-1" className="saber-blade"></div>}
                        </CSSTransitionGroup>
                        <div
                            className="saber-handle-container"
                            onClick={() => this.toggleLightSaber(1)}>
                            <div className="saber-handle-top-top"></div>
                            <div className="saber-handle-top-bottom"></div>
                            <div className="saber-handle-top-pattern-container">
                                <div className="saber-handle-top-pattern-1"></div>
                                <div className="saber-handle-top-pattern-2"></div>
                                <div className="saber-handle-top-pattern-3"></div>
                            </div>
                            <div className="saber-middle-cover"></div>
                            <div className="saber-middle-button-cover"></div>
                            <div
                                className="saber-middle-button-button"
                                style={this.state.showBlade1
                                ? {
                                    backgroundColor: "#00ff09"
                                }
                                : {
                                    backgroundColor: "rgb(186, 0, 0)"
                                }}></div>
                            <div className="saber-bottom-stem"></div>
                            <div className="saber-bottom-left"></div>
                            <div className="saber-bottom-screw"></div>
                            <div className="saber-bottom-bottom"></div>
                            <div className="saber-handle-main"></div>
                            <div className="saber-color-indicator saber-color-indicator-1"></div>
                        </div>
                    </div>

                    <div className="saber-container" id="saber-2">
                        <CSSTransitionGroup
                            transitionName="slide_in"
                            transitionEnterTimeout={200}
                            transitionLeaveTimeout={200}>
                            {this.state.showBlade2 && <div key="saber-blade" id="blade-2" className="saber-blade"></div>}
                        </CSSTransitionGroup>
                        <div
                            className="saber-handle-container"
                            onClick={() => this.toggleLightSaber(2)}>
                            <div className="saber-handle-top-top"></div>
                            <div className="saber-handle-top-bottom"></div>
                            <div className="saber-handle-top-pattern-container">
                                <div className="saber-handle-top-pattern-1"></div>
                                <div className="saber-handle-top-pattern-2"></div>
                                <div className="saber-handle-top-pattern-3"></div>
                            </div>
                            <div className="saber-middle-cover"></div>
                            <div className="saber-middle-button-cover"></div>
                            <div
                                className="saber-middle-button-button"
                                style={this.state.showBlade2
                                ? {
                                    backgroundColor: "#00ff09"
                                }
                                : {
                                    backgroundColor: "rgb(186, 0, 0)"
                                }}></div>
                            <div className="saber-bottom-stem"></div>
                            <div className="saber-bottom-left"></div>
                            <div className="saber-bottom-screw"></div>
                            <div className="saber-bottom-bottom"></div>
                            <div className="saber-handle-main"></div>
                            <div className="saber-color-indicator saber-color-indicator-2"></div>
                        </div>
                    </div>

                    <div className="saber-container" id="saber-3">
                        <CSSTransitionGroup
                            transitionName="slide_in"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={500}>
                            {this.state.showBlade3 && <div key="saber-blade" id="blade-3" className="saber-blade"></div>}
                        </CSSTransitionGroup>
                        <div
                            className="saber-handle-container"
                            onClick={() => this.toggleLightSaber(3)}>
                            <div className="saber-handle-top-top"></div>
                            <div className="saber-handle-top-bottom"></div>
                            <div className="saber-handle-top-pattern-container">
                                <div className="saber-handle-top-pattern-1"></div>
                                <div className="saber-handle-top-pattern-2"></div>
                                <div className="saber-handle-top-pattern-3"></div>
                            </div>
                            <div className="saber-middle-cover"></div>
                            <div className="saber-middle-button-cover"></div>
                            <div
                                className="saber-middle-button-button"
                                style={this.state.showBlade3
                                ? {
                                    backgroundColor: "#00ff09"
                                }
                                : {
                                    backgroundColor: "rgb(186, 0, 0)"
                                }}></div>
                            <div className="saber-bottom-stem"></div>
                            <div className="saber-bottom-left"></div>
                            <div className="saber-bottom-screw"></div>
                            <div className="saber-bottom-bottom"></div>
                            <div className="saber-handle-main"></div>
                            <div className="saber-color-indicator saber-color-indicator-3"></div>
                        </div>
                    </div>

                    <div className="saber-container" id="saber-4">
                        <CSSTransitionGroup
                            transitionName="slide_in"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={500}>
                            {this.state.showBlade4 && <div key="saber-blade" id="blade-4" className="saber-blade"></div>}
                        </CSSTransitionGroup>
                        <div
                            className="saber-handle-container"
                            onClick={() => this.toggleLightSaber(4)}>
                            <div className="saber-handle-top-top"></div>
                            <div className="saber-handle-top-bottom"></div>
                            <div className="saber-handle-top-pattern-container">
                                <div className="saber-handle-top-pattern-1"></div>
                                <div className="saber-handle-top-pattern-2"></div>
                                <div className="saber-handle-top-pattern-3"></div>
                            </div>
                            <div className="saber-middle-cover"></div>
                            <div className="saber-middle-button-cover"></div>
                            <div
                                className="saber-middle-button-button"
                                style={this.state.showBlade4
                                ? {
                                    backgroundColor: "#00ff09"
                                }
                                : {
                                    backgroundColor: "rgb(186, 0, 0)"
                                }}></div>
                            <div className="saber-bottom-stem"></div>
                            <div className="saber-bottom-left"></div>
                            <div className="saber-bottom-screw"></div>
                            <div className="saber-bottom-bottom"></div>
                            <div className="saber-handle-main"></div>
                            <div className="saber-color-indicator saber-color-indicator-4"></div>
                        </div>
                    </div>
                </div>}
            </div>
        )
    }
}

export default Sabers;