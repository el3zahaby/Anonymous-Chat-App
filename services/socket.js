module.exports = io => {
    io.on('connection',(socket) => {
        socket.on('sayToUserImConnected',({senderId,myId:connectedId,isConnected,isDisconnected}) =>{
            io.emit(`${senderId}:connected`,{isConnected,connectedId,isDisconnected})
        });

        socket.on('SayToUserOtherUserTyping',(data) => {
            io.emit(`${data.senderId}:typing`,data);
        });

        socket.on('sendMsgToOtherUser',user => {
            let {senderId,myNickName:senderNicName,userMessage} = user
            io.emit(senderId,{senderNicName,userMessage})
        })

    });
};