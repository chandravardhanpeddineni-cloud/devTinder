const mongoose = require('mongoose');


const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: [ "ignore", "interested", "accpeted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
{
    timestamps: true,
}
);


connectionRequestSchema.index({ fromUserId: 1, toUserId: 1});


connectionRequestSchema.pre("save", function(next) {                    //whenever you called .save() before saving pre called name itself say pre called
    const connectionRequest = this;
    const { fromUserId, toUserId } = connectionRequest;
    //validation before saving checking the fromUserId 
    if(fromUserId.equals(toUserId)) {
        throw new Error("you cannot send connection Request to yourself");
    }  
    next();
});

const ConnectionRequestModel = mongoose.model("ConnectionRequestModel", connectionRequestSchema);

module.exports =  ConnectionRequestModel; 