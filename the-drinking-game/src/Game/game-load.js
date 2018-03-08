import React, {Component} from 'react';
import fire from '../Backend/fire';

class GameLoad extends Component {
    constructor() {
        super();

        this.state = {
            gameCode: "",
            valid: true,
            players: []
        }
    }

    componentWillMount() {
        let gameCode = this.props.match.params.String;
        let gameRef = fire
            .database()
            .ref('games')
            .child(gameCode);
        gameRef.on('value', (snapshot) => {
            console.log("Snapshot", snapshot.val());
            if (snapshot.val() === null) {
                this.setState({valid: false});
                for (let key in snapshot.val()) {
                    console.log("Key", key);
                }
            }
        });
    }

    render() {
        return (
            <div className="game-page">
                <h1>{this.state.valid
                        ? "Start Game"
                        : "Invalid Game Code"}</h1>
                <div
                    className={this.state.valid
                    ? "game_load"
                    : "hide"}>Loading...</div>
            </div>
        );
    }
}

export default GameLoad;
