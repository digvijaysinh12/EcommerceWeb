import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        require:true
    },
    address:{
        type:String,
        required:true
    },
    quetion:{
        type:String,
        require:true
    }   ,
    role:{
        type:Number,
        default:0
    },
},
    {timestamps:true}
);

export default mongoose.model('users',userSchema);