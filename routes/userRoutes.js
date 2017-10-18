const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = app => {

    app.post('/api/user', async (req,res) => {

        let {nickName,genUserId:userId} = req.body;

        let saveUser = await new User({ nickName,userId }).save();


        let getOtherUser = await User.find({ isEngaged:false,_id:{ $nin:saveUser._id } }).sort({ "connectAt":-1 });
        if(getOtherUser.length > 0){
            let selectedUser = getOtherUser[0];
            let commonConnectingId = saveUser.userId + selectedUser.userId;


            await User.findByIdAndUpdate(selectedUser._id,{commonConnectingId,isEngaged:true},{new:true});
            await User.findByIdAndUpdate(saveUser._id,{commonConnectingId,isEngaged:true},{new:true});
            res.json({
                        err:null,
                        commonConnectingId,
                        senderId:selectedUser.userId,
                        senderNickName:selectedUser.nickName,
                        receiveMsgId:saveUser.userId,
            })

        }else {
            res.json({err:"No User Found",
                    receiveMsgId:saveUser.userId,
                    senderId:null,
                    senderNickName:null,  })
        }
    })

    app.post('/api/user/delete',async (req,res) => {

        let {userId} = req.body
        await User.remove({userId})
        res.end()

    })
};