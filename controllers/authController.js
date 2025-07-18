import { useReducer } from "react";
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";
import otpGeneraotor from "otp-generator"
import nodemailer from "nodemailer";

export const registerController = async (req, res) => {
    const { name, email, password, phone, address, quetion } = req.body;
    try {
        if (!name) {
            return res.send({ message: 'Name is required' });
        }
        if (!email) {
            return res.send({ message: 'Email is required' });
        }
        if (!password) {
            return res.send({ message: 'Password is required' });
        }
        if (!phone) {
            return res.send({ message: 'Phone is required' });
        }
        if (!address) {
            return res.send({ message: 'Adress is required' });
        }
        if (!quetion) {
            return res.send({ message: 'Sports Name is required' });
        }
        //existing user
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'already Register please login',
            });
        }

        //register user
        const hashedPassword = await hashPassword(password);

        const user = new userModel({ name, email, password: hashedPassword, phone, address, quetion }).save();

        res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user: name
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error,
        })
    }
}
const otpStore = {};
export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });

        const otp = otpGeneraotor.generate(6, { digits: true, alphabets: false });
        otpStore[email] = otp;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        })

        const mailOptions = {
            from: '"SmartPhone App" <process.env.USER>',
            to: email,
            subject: "Email Verification OTP",
            text: `Your OTP for verification is ${otp}. It is valid fot t minutes.`,
        };
        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ success: true, message: "OTP sent to email" });
        } catch (err) {
            res.status(500).json({ success: false, message: "Failed to send email", error: err.message });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Sending OTP',
            error: error,
        })
    }
}

export const verifyOTP = async(req,res) => {
    const {email,otp} = req.body;
    if(otpStore[email] && otpStore[email] === otp){
        delete otpStore[email];
        return res.status(200).json({success:true, message : "OTP verified successfully"});
    }else{
        return res.status(400).json({
            success: false,
            message: "Invalid or expired OTP"
        });
    }
}
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password"
            });
        }
        //check user
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).send({
                success: false,
                message: 'email is not registered'
            });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            res.status(404).send({
                success: false,
                message: "Invalid password"
            });
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).send({
            success: true,
            message: "Login Successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Login',
            error: error,
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


export const testController = (req, res) => {
    res.send("Protected Routes");
}

// update profile

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;

        const user = await userModel.findById(req.user._id);

        //password
        if (password && password.length < 6) {
            return res.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Update profile",
            error,
        });
    }
}


//orders

export const getOrderController = async (req, res) => {

  try {
    const orders = await orderModel.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name")
      .lean();
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }

}

export const getAllOrderController = async(req,res) => {
    try{
        const orders = await orderModel.find({}).populate('products',"-photo").populate("buyer","name").sort({ createdAt: -1 });

        res.json(orders);
    }catch(err){
        console.error("error fetching all order: ",err.message);
        res.status(500).json({ error: "Integernal Server Error"})
    }
}

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};