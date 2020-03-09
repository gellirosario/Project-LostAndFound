import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ChatMessage from './ChatMessage';
import ChatApp from './ChatApp';
import { default as Chatkit } from '@pusher/chatkit-server';
import {
    Card,
    CardBody,
} from 'reactstrap';

const chatkit = new Chatkit({
    instanceLocator: "v1:us1:de78f0a4-48a8-489c-ad96-64d645e64c91",
    key: "5c6d321d-eebb-404e-b7ae-7c025dbb54cc:Kx9HrJpQsNqKLX3cMT4tplzwf2HV93/NGwik85JiFjY="
})

class Chat extends Component {

    constructor(props) {
        super(props);

        var username = this.props.auth.user.email.split('@')[0];

        console.log("here" + this.props.auth.user.email.split('@')[0]);

        this.state = {
            currentUsername: username,
            currentId: this.props.auth.user.email,
            currentView: 'ChatMessage'
        }
        this.changeView = this.changeView.bind(this);
        this.createUser(this.state.currentUsername);
    }

    createUser(username) {
        chatkit.createUser({
            id: username,
            name: username,
        })
            .then((username) => {
                this.setState({
                    currentUsername: username,
                    currentId: username,
                    currentView: 'chatApp'
                })
            }).catch((err) => {
                if (err.status === 400) {
                    this.setState({
                        currentUsername: username,
                        currentId: username,
                        currentView: 'chatApp'
                    })
                } else {
                    console.log(err.status);
                }
            });
    }

    changeView(view) {
        this.setState({
            currentView: view
        })
    }

    render() {
        let view = '';
        if (this.state.currentView === "ChatMessage") {
            view = <ChatMessage changeView={this.changeView} />
        } else if (this.state.currentView === "chatApp") {
            view = <ChatApp currentId={this.state.currentId} />
        }

        const { user } = this.props.auth;

        if (user.isAuthenticated === false) return <Link to="/" />;

        return (
            <div className="animated fadeIn">
                <Card style={{height:'100%'}}>
                    <CardBody style={{height:'100%'}}>
                        <div >
                            {view}
                        </div>
                    </CardBody>
                </Card>
            </div>
        )
    }
}


Chat.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
)(Chat);