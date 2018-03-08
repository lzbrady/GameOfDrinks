import React, {Component} from 'react';

class MainPage extends Component {
    constructor() {
        super();

        this.state = {
            playerName: ""
        }

        this.handleChange = this
            .handleChange
            .bind(this);
    }

    handleChange(event) {
        this.setState({playerName: event.target.value});
        console.log(this.state.playerName);
    }

    render() {
        return (
            <div className="main-page">
                <h1>The Drinking Game</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            onChange={this.handleChange}
                            name="name"
                            placeholder="Player Name"/>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        );
    }
}

export default MainPage;
