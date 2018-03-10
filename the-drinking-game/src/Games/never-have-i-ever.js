import React, {Component} from 'react';

import {playRound, finishRound} from '../Backend/database-nhie';
import {redirect} from '../Backend/database';

import './never-have-i-ever.css';

class NeverHaveIEver extends Component {
    constructor() {
        super();

        this.state = {
            card: ""
        }

        this.finish = this
            .finish
            .bind(this);
    }

    componentDidMount() {
        playRound(this.props.location.pathname.substring(6, 11)).then((card) => {
            this.setState({card: card});
        });
    }

    finish() {
        let gameCode = this
            .props
            .location
            .pathname
            .substring(6, 11);
        finishRound(gameCode).then(() => {
            redirect(gameCode, `/play/${gameCode}/games/`).then((rtn) => {
                setTimeout(() => {
                    redirect(gameCode, false);
                }, 100);
            });
        });
    }

    render() {
        return (
            <div className="never-have-i-ever">
                <h1>Never Have I Ever</h1>
                <div className="nhie-card">
                    <h3>Drink if you have...</h3>
                    <p className="nhie-content">{this.state.card}</p>
                    <p className="nhie-catch">*If nobody has, then everybody drinks</p>
                </div>
                <button className="end-round" onClick={this.finish}>End Round</button>
            </div>
        );
    }
}

export default NeverHaveIEver;
