import React, {Component} from 'react';

import './contact.css';

class Contact extends Component {
    constructor() {
        super();
    }

    componentDidMount() {}

    render() {
        return (
            <div className="contact-div">
                <iframe
                    id="JotFormIFrame-81358164584161"
                    className="contact-iframe"
                    onLoad={window
                    .parent
                    .scrollTo(0, 0)}
                    allowtransparency="true"
                    allowFullScreen="false"
                    allow="geolocation; microphone; camera"
                    src="https://form.jotform.com/81358164584161"
                    frameBorder="0"
                    title="Contact Iframe"
                    scrolling="no"></iframe>
            </div>
        )
    }
}

export default Contact;