const mongoose = require("mongoose")

const eventSchema = new Schema({
    name:{type:String,required:true},
    date:{type:Date,required:true},
    location:{type:String,required:true},
    desc:{type:String},
    attendees:{type:[String],default:[]},
    head:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
})

Event=mongoose.model("Event",eventSchema)

module.exports = Event