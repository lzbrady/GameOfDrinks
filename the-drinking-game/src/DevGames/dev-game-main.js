import React, {Component} from 'react';
import {Route, HashRouter} from "react-router-dom";

import NeverHaveIEver from './never-have-i-ever';

class DevGames extends Component {
    render() {
        return (
            <HashRouter>
                <div className="App">
                    <div className="content">
                        <h1>Dev Games</h1>
                        <Route exact path="/devgames/nhie" component={NeverHaveIEver}/>
                    </div>
                </div>
            </HashRouter>
        );
    }
}

export default DevGames;
