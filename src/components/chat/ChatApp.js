import React, { Component } from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import Input from './Input';
import MessageList from './MessageList';
import {
    CardTitle,
    Col,
    Row,
} from 'reactstrap';
import Swal from 'sweetalert2'

const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    padding: '50px',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

class ChatApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            currentRoom: { users: [] },
            messages: [],
            users: []
        }
        this.addMessage = this.addMessage.bind(this);
    }

    componentDidMount() {

        Toast.fire({
            icon: 'info',
            title: 'Loading...'
        })

        const chatManager = new ChatManager({
            instanceLocator: "v1:us1:de78f0a4-48a8-489c-ad96-64d645e64c91",
            userId: this.props.currentId,
            tokenProvider: new TokenProvider({
                url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/de78f0a4-48a8-489c-ad96-64d645e64c91/token"
            })
        })

        chatManager
            .connect()
            .then(currentUser => {
                this.setState({ currentUser: currentUser })

                return currentUser.subscribeToRoom({
                    roomId: "95130309-e65d-47f6-a9df-39b76f41600c",
                    messageLimit: 100,
                    hooks: {
                        onMessage: message => {
                            this.setState({
                                messages: [...this.state.messages, message],
                            })
                        },
                    }
                })
            })
            .then(currentRoom => {
                this.setState({
                    currentRoom,
                    users: currentRoom.userIds
                })
            })
            .catch(error => console.log(error))


    }


    addMessage(text) {
        console.log(this.state);
        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.currentRoom.id
        })
            .catch(error => console.error('error', error));
    }

    getCommands() {
        Swal.fire({
            icon: "info",
            title: "Bot Commands",
            html:
                "<p><b>[Translate]</b></br><b>Input:</b> @trbot translate 'message' to 'language'</br>" +
                "<i><b>Example:</b> @trbot translate 'hello' to french</i></p>",
            footer: "<a href='https://cloud.google.com/translate/docs/languages'>Supported Languages</a>"
        })
    }

    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <CardTitle className="h1" style={{ paddingTop: 10 }}>Let's Talk!</CardTitle>
                    </Col>
                    <Col sm="1.2" style={{ marginRight: 20 }}>
                        <button className="start_button" onClick={this.getCommands}>Bot Commands</button>
                    </Col>
                </Row>
                <h2 className="chat-header"></h2>

                <hr />
                <MessageList messages={this.state.messages} />
                <Input className="input-field" onSubmit={this.addMessage} />
            </div>
        )
    }
}

export default ChatApp;