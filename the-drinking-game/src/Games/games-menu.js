import React, {Component} from 'react';
import {Route, HashRouter, Link} from "react-router-dom";
import {redirect} from '../Backend/database';
import fire from '../Backend/fire';

import NeverHaveIEver from './never-have-i-ever';
import MostLikelyTo from './most-likely-to';
import CaptionContest from './caption-contest';
import Trivia from './trivia';

class GamesMenu extends Component {

    constructor() {
        super();

        this.state = {
            showMenu: true,
            gameCode: ""
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
        gameRef.on('value', (snapshot) => {
            if (snapshot.key === 'redirect' && snapshot.val()) {
                this
                    .props
                    .history
                    .push(snapshot.val());
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
                        <h1>The  Game</h1>
                        {this.state.showMenu && <div className="games-menu-list">
                            <h3>Play a Mini Game</h3>
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
                        </div>
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default GamesMenu;
