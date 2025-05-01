import mongoose,{Schema} from "mongoose"

const eventSchema = new Schema({
    name:{type:String,required:true},
    date:{type:Date,required:true},
    location:{type:String,required:true},
    desc:{type:String},
    attendees:{type:[mongoose.Schema.Types.ObjectId],ref:"User"},
    head:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    poster:{type:String,required:true}
})

export const Event=mongoose.model("Event",eventSchema)