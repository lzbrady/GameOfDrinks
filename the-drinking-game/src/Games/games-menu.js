import React, {Component} from 'react';
import {Route, HashRouter, Link} from "react-router-dom";
import {redirect} from '../Backend/database';
import ReactTooltip from 'react-tooltip'
import fire from '../Backend/fire';

import NeverHaveIEver from './never-have-i-ever';
import MostLikelyTo from './most-likely-to';
import CaptionContest from './caption-contest';
import Trivia from './trivia';
import RollTheDice from './roll-the-dice';

import MainGame from '../MainGame/main-game';

import MdInfoOutline from 'react-icons/lib/md/info-outline';

class GamesMenu extends Component {

    constructor() {
        super();

        this.state = {
            showMenu: true,
            gameCode: "",
            playingFullGame: false
        }

        this.routeChange = this
            .routeChange
            .bind(this);
    }

    componentDidMount() {
        let gameCode = this
            .props
            .location
            .pathname
            .substring(6, 11);

        let gameRef = fire
            .database()
            .ref('games')
            .child(gameCode)
            .child('redirect');

        // Listener for redirects
        gameRef.on('value', (snapshot) => {
            if (snapshot.key === 'redirect' && String(snapshot.val()).includes("restart")) {
                this.setState({showMenu: true});
                redirect(this.state.gameCode, false);
                window
                    .location
                    .reload(true);
            } else if (snapshot.key === 'redirect' && snapshot.val()) {
                this
                    .props
                    .history
                    .push(snapshot.val());
            }
        });
        // Listener for if full game is being played
        fire
            .database()
            .ref('games')
            .child(gameCode)
            .child('metadata')
            .child('isFullGame')
            .on('value', (snapshot) => {
                if (snapshot.val()) {
                    this.setState({playingFullGame: true});
                }
            });

        this.setState({gameCode: gameCode});
        if (this.props.location.pathname.substring(11) === '/games/') {
            this.setState({showMenu: true});
        } else {
            this.setState({showMenu: false});
        }

        window.onpopstate = this.onBackButtonEvent;
    }

    onBackButtonEvent = (e) => {
        e.preventDefault();
        console.log("BACK BUTTON");
        this.setState({
            showMenu: !this.state.showMenu
        });
    }

    routeChange(to) {
        this.setState({showMenu: false});
        if (to === 'main-game') {
            this.setState({playingFullGame: true});
        }
        redirect(this.state.gameCode, `/play/${this.state.gameCode}/games/${to}`).then((rtn) => {
            setTimeout(() => {
                redirect(this.state.gameCode, false);
            }, 1);
        });
    }

    render() {
        return (
            <HashRouter>
                <div className="App">
                    <div className="content">
                        <h1>The Drinking Game</h1>
                        {!this.state.playingFullGame && this.state.showMenu && <div className="games-menu-list">
                            <h3 className="title-with-tooltip">Play the Full Game</h3>
                            <MdInfoOutline data-tip data-for='main-game' className="icon"/>

                            <Link
                                onClick={(e) => this.routeChange('main-game')}
                                to={`/play/${this.state.gameCode}/games/main-game`}
                                className="games-menu-list-item">Start Game</Link>

                            <ReactTooltip
                                className="tooltip"
                                id="main-game"
                                place="bottom"
                                type="info"
                                effect="solid">
                                <span>Cycles through the mini games.</span><br/>
                                <span>Points are tracked and drinks are drank!</span>
                            </ReactTooltip>

                            <h3 className="title-with-tooltip">Play a Mini Game</h3>
                            <MdInfoOutline data-tip data-for='mini-game' className="icon"/>

                            <ReactTooltip
                                className="tooltip"
                                id="mini-game"
                                place="bottom"
                                type="info"
                                effect="solid">
                                <span>Points arent tracked,</span><br/>
                                <span>but you can still drink!</span>
                            </ReactTooltip>

                            <Link
                                onClick={(e) => this.routeChange('never-have-i-ever')}
                                to={`/play/${this.state.gameCode}/games/never-have-i-ever`}
                                className="games-menu-list-item">Never Have I Ever</Link>
                            <Link
                                onClick={(e) => this.routeChange('most-likely-to')}
                                to={`/play/${this.state.gameCode}/games/most-likely-to`}
                                className="games-menu-list-item">Most Likely</Link>
                            <Link
                                onClick={(e) => this.routeChange('caption-contest')}
                                to={`/play/${this.state.gameCode}/games/caption-contest`}
                                className="games-menu-list-item">Caption Contest</Link>
                            <Link
                                onClick={(e) => this.routeChange('trivia')}
                                to={`/play/${this.state.gameCode}/games/trivia`}
                                className="games-menu-list-item">Trivia</Link>
                            <Link
                                onClick={(e) => this.routeChange('roll-the-dice')}
                                to={`/play/${this.state.gameCode}/games/roll-the-dice`}
                                className="games-menu-list-item">Play with Fate</Link>
                        </div>}
                        <div>
                            <Route
                                exact
                                path="/play/:String/games/never-have-i-ever"
                                component={NeverHaveIEver}/>
                            <Route
                                exact
                                path="/play/:String/games/most-likely-to"
                                component={MostLikelyTo}/>
                            <Route
                                exact
                                path="/play/:String/games/caption-contest"
                                component={CaptionContest}/>
                            <Route exact path="/play/:String/games/trivia" component={Trivia}/>
                            <Route exact path="/play/:String/games/roll-the-dice" component={RollTheDice}/>
                            <Route exact path="/play/:String/games/main-game" component={MainGame}/>
                        </div>
                    </div>
                    <form
                        action="https://www.paypal.com/cgi-bin/webscr"
                        method="post"
                        target="_blank"
                        className="paypal">
                        <input type="hidden" name="cmd" value="_s-xclick"/>
                        <input type="hidden" name="hosted_button_id" value="T9FJG2UANMSCW"/>
                        <input
                            type="image"
                            src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
                            border="0"
                            name="submit"
                            alt="PayPal - The safer, easier way to pay online!"/>
                        <img
                            alt=""
                            border="0"
                            src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
                            width="1"
                            height="1"/>
                    </form>
                </div>
            </HashRouter>
        );
    }
}

export default GamesMenu;
