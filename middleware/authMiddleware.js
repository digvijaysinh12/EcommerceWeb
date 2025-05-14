import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";


export const requireSignIn = async (req, res, next) => {
    try {
        // Attempt to verify the token
        const decoded = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log('Token verification failed:', error);

        // Specific handling for JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({
                success: false,
                message: "Token has expired"
            });
        }

        // Handle other verification errors
        return res.status(401).send({
            success: false,
            message: "Token verification failed. Invalid token"
        });
    }
};



    export const isAdmin = async(req,res,next) =>{
        try{
            const user = await userModel.findById(req.user._id);
            if(user.role!==1){
                res.status(401).send({
                    success:false,
                    message:"unauthorized user",
                });
            }else{
                next();
            }
        }catch(error){
            res.status(401).send({
                success:false,
                message:'Error in admin middleware',
                error
            })
        }
    }