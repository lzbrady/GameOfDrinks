import React, {Component} from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

import {redirect, isFullGame, getResults} from '../Backend/database';
import {displayPattern, checkPath, getSaberResults} from '../Backend/database-sabers';

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
            drinks: []
        }

        this.toggleLightSaber = this
            .toggleLightSaber
            .bind(this);
        this.getResults = this
            .getResults
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

        displayPattern(gameCode).then((pattern) => {
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
                            case 1:
                                newColor = "green";
                                break;
                            case 2:
                                newColor = "blue";
                                break;
                            case 3:
                                newColor = "purple";
                                break;
                            case 4:
                                newColor = "red";
                                break;
                            default:
                                this.setState({allowClicks: true});
                                break;
                        }
                        this.setState({bgColor: newColor});
                    }, 1000 * i);
                }
            }
        });

        var timer = setInterval(() => {
            if (this.state.timeLeft < 1) {
                console.log("Get drinks");
            }
            this.setState({
                timeLeft: this.state.timeLeft - 1
            });
        }, 1000);

        // setTimeout(() => {     resetValues(gameCode, 'drinks'); redirect(gameCode,
        // `/play/${gameCode}/games/${this.state.redirectTo}`).then((rtn) => {
        // setTimeout(() => {             redirect(gameCode, false);         }, 1); });
        // }, 0);
        setTimeout(() => {
            this.getResults();
        }, 500);
    }

    getResults() {
        console.log("Code", this.state.gameCode);
        getSaberResults(this.state.gameCode).then((results) => {
            console.log("Results", results);
            let scores = [];
            for (let key in results) {
                if (results.hasOwnProperty(key) && results[key]) {
                    scores.push(key);
                }
            }
            if (scores.includes("No One")) {
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
                    }, 1000);
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
                    className={this.state.timeLeft < 0
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

                {this.state.timeLeft >= 0 && <div
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