import React, {Component} from 'react';
import {Route, HashRouter, Link} from "react-router-dom";
import {redirect} from '../Backend/database';
import fire from '../Backend/fire';

import NeverHaveIEver from './never-have-i-ever';
import MostLikelyTo from './most-likely-to';

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
                        <h1>The Drinking Game</h1>
                        {this.state.showMenu && <div className="games-menu-list">
                            <Link
                                onClick={(e) => this.routeChange('never-have-i-ever')}
                                to={`/play/${this.state.gameCode}/games/never-have-i-ever`}
                                className="games-menu-list-item">Never Have I Ever</Link>
                            <Link
                                onClick={(e) => this.routeChange('most-likely-to')}
                                to={`/play/${this.state.gameCode}/games/most-likely-to`}
                                className="games-menu-list-item">Most Likely</Link>
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
                        </div>
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default GamesMenu;
