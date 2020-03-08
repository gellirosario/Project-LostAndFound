import React, { Component } from 'react';
import moment from 'moment';
import Moment from 'react-moment';

class MessageList extends Component {

    render() {
        return (
            <ul className="message-list">
                {this.props.messages.map((message, index) => (
                    <li className="message-box" key={index}>
                        <h4 className="message-sender">{message.senderId} [<Moment
                            calendar={{
                                lastDay: '[Yesterday at] LT',
                                sameDay: '[Today at] LT',
                                nextDay: '[Tomorrow at] LT',
                                lastWeek: '[last] dddd [at] LT',
                                nextWeek: 'dddd [at] LT',
                                sameElse: 'L',
                                lastDay: '[Yesterday at] LT',
                                lastWeek: '[last] dddd [at] LT',
                            }}
                        >
                            {message.createdAt}
                        </Moment>]
                        </h4>
                        <p className="message-text">{message.text}</p>
                    </li>
                ))}
                <li></li>
            </ul>
        )
    }
}
export default MessageList;