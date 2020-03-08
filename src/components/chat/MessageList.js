import React, { Component } from 'react';

class MessageList extends Component {

    constructor() {
        super();

        var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " [" + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + "]";

        this.state = {
            date: date
        };
    }

    render() {
        return (
            <ul className="message-list">
                {this.props.messages.map((message, index) => (
                    <li className="message-box" key={index}>
                        <h4 className="message-sender">{message.senderId} @ {this.state.date} </h4>
                        <p className="message-text">{message.text}</p>
                    </li>
                ))}
                <li></li>
            </ul>
        )
    }
}
export default MessageList;