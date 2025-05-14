import { useReducer } from "react";
import { hashPassword,comparePassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async(req,res) => {
    const { name, email, password, phone, address,quetion } = req.body;
    try{
        if(!name){
            return res.send({message:'Name is required'});
        }
        if(!email){
            return res.send({message:'Email is required'});
        }
        if(!password){
            return res.send({message:'Password is required'});
        }
        if(!phone){
            return res.send({message:'Phone is required'});
        }
        if(!address){
            return res.send({message:'Adress is required'});
        }
        if(!quetion){
            return res.send({message:'Sports Name is required'});
        }        
        //existing user
        const existingUser = await userModel.findOne( {email} );

        if(existingUser){
            return res.status(200).send({
                success:false,
                message:'already Register please login',
            });
        }

        //register user
        const hashedPassword = await hashPassword(password);

        const user = new userModel({name,email,password:hashedPassword,phone,address,quetion}).save();

        res.status(201).send({
            success:true,
            message:"User Register Successfully",
            user:name
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error,
        })
    }
}

export const loginController = async(req,res) => {
    try{
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(404).send({
                success:false,
                message:"Invalid email or password"
            });
        }
        //check user
        const user = await userModel.findOne({email});
        if(!user){
            res.status(404).send({
                success:false,
                message:'email is not registered'
            });
        }
        const match = await comparePassword(password,user.password);
        if(!match){
            res.status(404).send({
                success:false,
                message:"Invalid password"
            });
        }
        //token
        const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.status(200).send({
            success:true,
            message:"Login Successfully",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
            },
            token
        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Login',
            error:error,
        })
    }
}

export const forgotPasswordController = async (req, res) => {
    try {
        console.log('Forgot Password API called', req.body);

        const { email, quetion, newPassword } = req.body;
        if (!email || !quetion || !newPassword) {
            console.log('Missing fields');
            return res.status(400).send({
                message: 'All fields (email, security question, new password) are required',
            });
        }

        const user = await userModel.findOne({ email, quetion });
        if (!user) {
            console.log('User not found');
            return res.status(404).send({
                success: false,
                message: 'Wrong Email or Answer',
            });
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });

        console.log('Password reset successful');
        res.status(200).send({
            success: true,
            message: 'Password Reset Successfully',
        });
    } catch (error) {
        console.error('Error in forgotPasswordController:', error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error,
        });
    }
};


export const testController = (req,res) => {
    res.send("Protected Routes");
}