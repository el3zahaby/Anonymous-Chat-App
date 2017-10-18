const mongoose = require('mongoose');
const {Schema} = mongoose

const UserSchema = new Schema({
   nickName:String,
   userId:String,
   connectedUserId:String,
   isEngaged:{
       type:Boolean,
       default:false
   },
   commonConnectingId:String,
    connectAt:{
       type:Date,
        default:Date.now()
    }
});
mongoose.model('User',UserSchema);

