import {fromJS} from 'immutable';
import {GOT_ALL_USER_DETAILS,UPDATE_SENDER_ID,PUSH_NEW_CHAT_PAYLOAD} from '../actions/types';

const initialState = fromJS({

    chats:[],
    receiveMsgId:null,
    senderId:null,
    senderNickName:null,
    myNickName:"",


});

export default function (state=initialState,action) {
    switch (action.type){
        case GOT_ALL_USER_DETAILS:
            return state.set('receiveMsgId',action.payload.receiveMsgId)
                            .set('senderId',action.payload.senderId)
                            .set('senderNickName',action.payload.senderNickName)
                            .set('myNickName',action.payload.myNickName);
        case UPDATE_SENDER_ID:
            return state.set('senderId',action.payload);
        case PUSH_NEW_CHAT_PAYLOAD:
            return state.set('chats',state.get('chats').concat(action.payload));
        default:
            return state
    }
}


