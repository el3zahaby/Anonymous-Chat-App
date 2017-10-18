import React,{Component} from 'react';
import {connect} from 'react-redux';
import shortID from 'shortid';
import {browserHistory} from 'react-router'
import axios from 'axios';
import * as homeActions from '../../actions/form_Actions';
import './index.css';


class Home extends Component{
    state = {
        btnDisable:false,
        nickName:""
    };
    handlePostUser = async (nickName,genUserId) => {
        this.setState({ btnDisable:true,nickName:"" });
        let {data:{receiveMsgId,senderId,senderNickName}} = await axios.post('/api/user',{nickName,genUserId});
            let payload = {
                receiveMsgId,
                senderId,
                senderNickName,
                myNickName:nickName
            };
        this.props.gotAlluserInfo(payload)
        browserHistory.push('/chat')

    };
    handleNickName = (e) => {
        e.preventDefault();
        let nickName = e.target.nickName.value;
        let genUserId = shortID.generate();

        nickName !== "" ? this.handlePostUser(nickName,genUserId) : alert('Enter Something')
    };
    render(){
        return(
            <div className="container">
                <div className="enterModal">
                    <form onSubmit={this.handleNickName} >
                        <input onChange={e => this.setState({nickName:e.target.value})} value={this.state.nickName} name="nickName" type="text" placeholder="Nick Name" />
                        <button disabled={this.state.btnDisable} type="submit">Next</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default connect(null,homeActions)(Home)