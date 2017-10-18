import {UPDATE_SENDER_ID,PUSH_NEW_CHAT_PAYLOAD} from './types';

export const updatedSenderId = payload => dispatch => {
    dispatch({type:UPDATE_SENDER_ID, payload})
};

export const pushNewMessage = payload => dispatch => {
  dispatch({ type:PUSH_NEW_CHAT_PAYLOAD,payload })
};