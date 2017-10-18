import {GOT_ALL_USER_DETAILS,UPDATE_SENDER_ID} from './types';



export const gotAlluserInfo = payload => dispatch =>{
  dispatch({type:GOT_ALL_USER_DETAILS,payload})
};

export const updatedSenderId = payload => dispatch => {
   dispatch({type:UPDATE_SENDER_ID, payload})
};