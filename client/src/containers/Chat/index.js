
import React, {Component} from 'react';
import {findDOMNode} from 'react-dom'
import {connect} from 'react-redux';
import './index.css';
import io from 'socket.io-client';
import * as chatActions from '../../actions/chat_Actions';
import {browserHistory} from 'react-router';
import axios from 'axios';
import CONFIG from '../../config'
let socket = io(CONFIG.SOCKET_URL);

class Chat extends Component{
    state = {
        userMessage:"",
        allChats:[],
        isConnected:false,
        isTyping:false,
        isDisconnected:false
    };
    timeout = 0;
    componentDidMount = () => {

        if(this.props.chats.get('myNickName')){
            socket.emit(`sayToUserImConnected`,{senderId:this.props.chats.get('senderId'),myId:this.props.chats.get('receiveMsgId'),isConnected:true,isDisconnected:false})

            socket.on(`${this.props.chats.get('receiveMsgId')}:connected`,({connectedId,isConnected,isDisconnected}) => {
                this.props.updatedSenderId(connectedId);
                if(isDisconnected){
                    this.userDisconnected();
                    browserHistory.push('/')
                }else {
                    this.setState({isConnected, isDisconnected})
                }
            });

            this.scrollToBottom();
            this.getMessage();
            this.getOtherUserTyping();

            if(this.props.chats.get('senderId')) this.setState({isConnected:true});
            this.watchforClosetab()
        }else {
            browserHistory.push('/')
        }

    };
    watchforClosetab = () => {
        window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();

            this.userDisconnected();
            return ev.returnValue = 'You are Disconnected Bye Bye';
        });
    }
    getOtherUserTyping = () => {
        socket.on(`${this.props.chats.get('receiveMsgId')}:typing`,data => {

            this.setState({
                isTyping:data.typing
            })
        })
    };
    getMessage = () => {
        if(this.props.chats.get('receiveMsgId')){
            socket.on(this.props.chats.get('receiveMsgId'),({senderNicName,userMessage}) => {
                let payload = {
                    fromMe:false,
                    senderNicName,
                    userMessage
                };

                this.props.pushNewMessage(payload)
            });
        }

    };
    sendMessagetoServer = (allPayload) => {
        let payload = {
            fromMe:true,
            senderNicName:allPayload.myNickName,
            userMessage:allPayload.userMessage
        };

        this.props.pushNewMessage(payload);
        socket.emit('sendMsgToOtherUser',allPayload)

    };
    handleUserMessage = e => {
        e.preventDefault();
        let allPayload = {
            senderId:this.props.chats.get('senderId'),
            myNickName:this.props.chats.get('myNickName'),
            userMessage:this.state.userMessage
        };
        this.sendMessagetoServer(allPayload)
        this.setState({
            userMessage:""
        })
    };
    sendUserTypingNotification = (data) => {
       socket.emit('SayToUserOtherUserTyping',data)
    };
    handleInputChange = e => {
        if(this.timeout) clearTimeout(this.timeout);
        this.setState({
            userMessage:e.target.value
        });

        if(this.props.chats.get('senderId'))
            this.sendUserTypingNotification({senderId: this.props.chats.get('senderId'),typing:true});

         this.timeout = setTimeout(() => {

            return this.props.chats.get('senderId') ? this.sendUserTypingNotification({senderId: this.props.chats.get('senderId'),typing:false}) : "";


        }, 300);
    };
    renderAllChats = () => {
        return (
            <div className="chatWrapper">
                {this.props.chats.get('chats').map(({fromMe,senderNicName,userMessage},i) => {
                    return fromMe ? <div key={i} className="rightMessage animateInMessage">
                        <div className="rightCon commonMessage">
                            <p>{userMessage}</p>
                            <span>{senderNicName}</span>
                        </div>
                    </div> : <div key={i} className="leftMessage animateInMessage">
                        <div className="leftCon commonMessage">
                            <p>{userMessage}</p>
                            <span>{senderNicName}</span>
                        </div>
                    </div>

                })}
            </div>
        )
    };
    componentDidUpdate() {
        this.scrollToBottom();
    }
    scrollToBottom = () => {
        const messagesContainer = findDOMNode(this.messagesContainer);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
    userDisconnected = async (e) => {
        socket.emit(`sayToUserImConnected`,{senderId:this.props.chats.get('senderId'),myId:this.props.chats.get('receiveMsgId'),isConnected:false,isDisconnected:true})
        browserHistory.push('/')
        return await axios.post('/api/user/delete',{userId:this.props.chats.get('receiveMsgId')})
    };
    render(){

        return(
            <div className="Chatcontainer">
                <div className="chatContainer">
                    <div ref={(el) => { this.messagesContainer = el; }}  className="allTextsMessages">
                        {this.renderAllChats()}

                    </div>
                    <div className="allStatus">
                        {this.state.isTyping  ? <div className="typing-indicator">
                            <span />
                            <span />
                            <span />
                        </div> : "" }
                        {this.state.isConnected  ? <p><svg className="svg-icon" viewBox="0 0 20 20">
                            <path fill="none" d="M9.997,13.867c-0.388,0-0.702,0.315-0.702,0.702v4.335c0,0.387,0.314,0.702,0.702,0.702
								c0.388,0,0.702-0.315,0.702-0.702v-4.335C10.698,14.182,10.384,13.867,9.997,13.867z" />
                            <path fill="none" d="M9.997,6.133c0.388,0,0.702-0.315,0.702-0.702V1.096c0-0.386-0.314-0.702-0.702-0.702
								c-0.388,0-0.702,0.316-0.702,0.702v4.335C9.295,5.818,9.609,6.133,9.997,6.133z" />
                            <path fill="none" d="M12.89,13.604c-0.193-0.334-0.621-0.449-0.958-0.256c-0.335,0.193-0.45,0.623-0.256,0.958l1.568,2.719
								c0.129,0.224,0.364,0.35,0.607,0.35c0.119,0,0.24-0.03,0.351-0.094c0.336-0.193,0.451-0.624,0.257-0.958L12.89,13.604z" />
                            <path fill="none" d="M7.107,6.394c0.129,0.225,0.366,0.351,0.607,0.351c0.119,0,0.239-0.031,0.35-0.095
								c0.336-0.193,0.451-0.623,0.256-0.958L6.753,2.976C6.561,2.639,6.13,2.527,5.796,2.72C5.46,2.913,5.345,3.344,5.54,3.678
								L7.107,6.394z" />
                            <path fill="none" d="M6.13,10c0-0.389-0.314-0.702-0.702-0.702H1.096c-0.388,0-0.702,0.312-0.702,0.702
								c0,0.386,0.314,0.702,0.702,0.702h4.333C5.816,10.702,6.13,10.386,6.13,10z" />
                            <path fill="none" d="M18.901,9.299h-4.335c-0.388,0-0.702,0.312-0.702,0.702c0,0.386,0.314,0.702,0.702,0.702h4.335
								c0.388,0,0.702-0.316,0.702-0.702C19.602,9.611,19.289,9.299,18.901,9.299z" />
                            <path fill="none" d="M9.997,6.755c-1.789,0-3.244,1.455-3.244,3.245c0,1.789,1.455,3.244,3.244,3.244
								c1.79,0,3.245-1.455,3.245-3.244C13.242,8.211,11.786,6.755,9.997,6.755z M9.997,11.842c-1.015,0-1.841-0.826-1.841-1.841
								c0-1.017,0.826-1.842,1.841-1.842c1.015,0,1.842,0.825,1.842,1.842C11.839,11.016,11.012,11.842,9.997,11.842z" />
                            <path fill="none" d="M17.021,13.245l-2.716-1.567c-0.334-0.192-0.765-0.077-0.958,0.258c-0.195,0.334-0.079,0.764,0.256,0.958
								l2.716,1.567c0.111,0.064,0.232,0.094,0.351,0.094c0.241,0,0.478-0.126,0.607-0.351C17.472,13.867,17.356,13.439,17.021,13.245z" />
                            <path fill="none" d="M2.973,6.755l2.716,1.568C5.8,8.386,5.921,8.416,6.04,8.416c0.241,0,0.478-0.126,0.607-0.35
								c0.194-0.334,0.079-0.765-0.256-0.958L3.675,5.54C3.341,5.349,2.91,5.462,2.717,5.797C2.522,6.133,2.637,6.561,2.973,6.755z" />
                            <path fill="none" d="M13.347,8.066c0.128,0.224,0.366,0.35,0.607,0.35c0.119,0,0.24-0.03,0.351-0.093l2.716-1.568
								c0.335-0.194,0.451-0.622,0.256-0.959c-0.193-0.337-0.623-0.45-0.958-0.257l-2.716,1.568C13.268,7.301,13.152,7.731,13.347,8.066z" />
                            <path fill="none" d="M6.647,11.935c-0.192-0.337-0.622-0.452-0.958-0.258l-2.716,1.567c-0.335,0.194-0.45,0.622-0.256,0.959
								c0.129,0.224,0.366,0.351,0.607,0.351c0.119,0,0.24-0.03,0.351-0.094l2.716-1.567C6.726,12.699,6.841,12.269,6.647,11.935z" />
                            <path fill="none" d="M11.931,6.65c0.111,0.064,0.232,0.095,0.351,0.095c0.241,0,0.478-0.126,0.607-0.351l1.567-2.716
								c0.194-0.334,0.079-0.765-0.257-0.958c-0.333-0.192-0.764-0.079-0.958,0.256l-1.568,2.716C11.481,6.026,11.596,6.457,11.931,6.65z" />
                            <path fill="none" d="M8.065,13.348c-0.33-0.191-0.763-0.079-0.958,0.256l-1.57,2.719c-0.194,0.334-0.079,0.764,0.256,0.958
								c0.109,0.064,0.232,0.094,0.351,0.094c0.241,0,0.477-0.126,0.607-0.35l1.57-2.719C8.516,13.971,8.401,13.541,8.065,13.348z" />
                        </svg>Connected</p> : <p>Disconnected (or) Searching</p>}

                    </div>
                    <div className="chatInputContainer">
                        <form onSubmit={this.handleUserMessage} >
                            <input value={this.state.userMessage} name="msg" onChange={this.handleInputChange} type="text" placeholder="Enter You Message" />
                        </form>
                        <button onClick={this.userDisconnected}>STOP</button>
                    </div>
                </div>
            </div>
        )
    }
}


function mapStateToProps({chats}) {
    return {
        chats
    }
}

export default connect(mapStateToProps,chatActions)(Chat)