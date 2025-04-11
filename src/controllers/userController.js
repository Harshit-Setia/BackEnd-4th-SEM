import express from 'express'
import {User} from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {uplodOnCloudinary} from '../utils/fileUplode.js'


//USER
const checkStatus = async (req,res)=>{
    try {
        const token=req.token;
        if(!token){
            res.status(200).json({message:"No Tken Found"})
        }
        const satus= jwt.verify(token,process.env.JWT_SECRET);
        if(satus)res.staus(200).json({message:"Welcom"})
            res.satus(203).json({message:"Login first"});
    } catch (error) {
        res.status(404).json({message:error})
    }
}

// register
const registerUser= async (req,res)=>{
    try {
        const{ username, email, password ,fullname}=req.body

        if([username,email,password,fullname].some((field)=>field?.trim()==="")){
            res.status(400).json({message:` ${field} can't be empty`});
            return;
        }
        // existing user check
        const existingUser=await User.findOne({
            $or: [{email},{username}]
        })
        if(existingUser){
            res.status(409).json({message:"User already exisits"})
            return
        }
        const avatarLocalPath=req.file?.path;
        let avatar;
        if(!avatarLocalPath){
            avatar=process.env.DEFAULT_USER;
        }
        else{
            avatar=await uplodOnCloudinary(avatarLocalPath);
            avatar=avatar?.url;
        }
        if(!avatar){
            res.status(500).json({message:"Cloudinary error"});
            return;
        }
        //password hash
        const hashPass= await bcrypt.hash(password,10)

        //creating new user
        const newUser = new User({
            username:username.toLowerCase(),
            email,
            fullname,
            password:hashPass,
            avatar
        })
        await newUser.save()
        res.status(201).json({message:"User registerd successfull"})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

// login
const loginUser= async (req,res)=>{
    try {
        const { email, password } = req.body;
        
        // existing user check
        const user=await User.findOne({email})
        if(!user){
            res.status(404).json({message:"User Not Found"})
            return
        }

        // compare password
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            res.status(400).json({message:"Invalid Password"})
            return
        }

        // generate JWT
        if(!process.env.JWT_SECRET){
            res.status(500).json({message:"Server Error, Contact admin"})
            return
        }
        const token= jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})

        res.status(200).json({token})

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export {registerUser,loginUser,checkStatus}