import mongoose from "mongoose"
import jwt from 'jsonwebtoken'

export const auth = (req,res,next)=>{
    const token =req.cookies?.token || req.headers?.authorization?.split(" ")[1]
    // console.log(token)
    if(!token){
        req.loged=false;
        return next();
    }

    try{
        if(!process.env.JWT_SECRET){
            return res.status(500).json({message:"contact admin"})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)

        req.user=decoded

        next()
    }
    catch(error){
        return res.status(500).json({error:"error"})
    }
}