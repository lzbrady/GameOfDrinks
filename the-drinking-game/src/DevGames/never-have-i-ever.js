import React, {Component} from 'react';

import {playRound} from '../Backend/database-nhie';

class NeverHaveIEver extends Component {
    constructor() {
        super();

        this.state = {
            card: ""
        }
    }

    componentDidMount() {
        playRound().then((card) => {
            console.log("Card:", card);
            this.setState({card: card});
        });
    }

    render() {
        return (
            <div className="never-have-i-ever">
                <h1>Never Have I Ever</h1>
                <h3>Drink if you have...</h3>
                <p>{this.state.card}</p>
                <p>*If nobody has, then everybody drinks</p>
            </div>
        );
    }
}

export default NeverHaveIEver;
