const express=require('express')
const User = require('../models/userModel.js')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


// register
const registerUser= async (req,res)=>{
    try {
        const{ username, email, password }=req.body

        // existing user check
        const existingUser=await User.findOne({email})
        if(existingUser){
            res.status(400).json({message:"User already exisits"})
            return
        }

        //password hash
        const hashPass= await bcrypt.hash(password,10)

        //creating new user
        newUser = new User({
            username,
            email,
            password:hashPass
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

module.exports = {registerUser,loginUser}