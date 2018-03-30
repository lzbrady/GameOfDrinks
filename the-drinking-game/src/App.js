import React, {Component} from 'react';
import {Route, HashRouter} from "react-router-dom";

import './App.css';

import MainPage from './main-page';
import GameLoad from './Game/game-load';
import GamesMenu from './Games/games-menu';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div className="App">
          <div className="content">
            <Route exact path="/" component={MainPage}/>
            <Route path='/lobby/:String' component={GameLoad}/>
            <Route path='/play/:String/games' component={GamesMenu}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default App;
