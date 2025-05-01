import mongoose,{Schema} from "mongoose"

const UserSchema = new Schema({
    username:{type:String,required: true, unique: true},
    email:{type:String,required: true, unique: true},
    password:{type:String,required: true},
    fullname:{type:String,required:true},
    avatar:{type:String,required:true},
    registeredEvent:{type:[mongoose.Schema.Types.ObjectId],ref:"Event"},
    refresfToken:{type:String}
})

export const User=mongoose.model("User",UserSchema)