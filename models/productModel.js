import mongoose from 'mongoose'
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,      
    },
    price:{
        type:Number,
        required:true, 
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true,      
    },
    photo:{
        data:Buffer,
        contentType:String,
        //for access photo i have used express-formidable package
    },
    shipping:{
        type:Boolean,    
    }, 
    quantity:{
        type:Number
    },  
}, {timestamps:true}
);

export default mongoose.model('Products', productSchema)