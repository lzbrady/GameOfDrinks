import React, {Component} from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

import {redirect, isFullGame} from '../Backend/database';

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
            showBlade4: false
        }

        this.toggleLightSaber = this
            .toggleLightSaber
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

        // Timer for timer...
        setTimeout(() => {
            // redirect(gameCode,
            // `/play/${gameCode}/games/${this.state.redirectTo}`).then((rtn) => {
            // setTimeout(() => {         redirect(gameCode, false);     }, 1); });
        }, 0);
    }

    toggleLightSaber(saber_number) {
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
        }
    }

    render() {
        return (
            <div className="sabers">
                <h1>Sabers</h1>
                <div className="all-sabers-container">
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
                        </div>
                    </div>

                    <div className="saber-container" id="saber-2">
                        <CSSTransitionGroup
                            transitionName="slide_in"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={500}>
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
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Sabers;