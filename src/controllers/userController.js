import express from 'express'
import {User} from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {uplodOnCloudinary} from '../utils/fileUplode.js'



//USER
const userData = async (req,res)=>{
    try {
        const userId = req.user?.id || req.params.id;
        const user=await User.findById(userId).select('-password');
        res.status(200).json(user);
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

        const options={
            httpOnly:true,
            secure:true
        }

        res.status(200).cookie("token",token,options).json({user,token})

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
const logoutUser = (req,res)=>{
    try{
        res.status(200).clearCookie("token",{httpOnly:true,secure:true}).json({message:"Logout successFull"})
    }catch(error){
        res.status(500).json({message:error.message})
    }
}
const updateUser = async (req, res) => {
    try {
      const userId = req.user?.id; // Access user ID from the authenticated request
  
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID not found' });
      }
  
      const { username, email, fullname, password, avatar } = req.body;
      const updates = {};
  
      if (username) {
        const existingUserWithUsername = await User.findOne({username});
        if (existingUserWithUsername) {
          return res.status(409).json({ message: 'Username already exists for another user' });
        }
        updates.username = username.toLowerCase();
      }
      if (email) {
        // Check if the new email already exists for another user
        const existingUserWithEmail = await User.findOne({email});
        if (existingUserWithEmail) {
          return res.status(409).json({ message: 'Email already exists for another user' });
        }
        updates.email = email;
      }
      if (fullname) {
        updates.fullname = fullname;
      }
      if (password) {
        const hashPass = await bcrypt.hash(password, 10);
        updates.password = hashPass;
      }
      if (req.file) {
        const avatarLocalPath = req.file.path;
        const cloudinaryResponse = await uplodOnCloudinary(avatarLocalPath);
        if (!cloudinaryResponse) {
          return res.status(500).json({ message: 'Error uploading new avatar to Cloudinary' });
        }
        updates.avatar = cloudinaryResponse.url;
      } else if (avatar && avatar !== process.env.DEFAULT_USER) {
        updates.avatar = avatar; // Allow updating with an existing URL
      }
  
      // If no updates are provided, return a message
      if (Object.keys(updates).length === 0) {
        return res.status(200).json({ message: 'No updates provided' });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true } // Return the updated document and run schema validators
      ).select('-password'); // Exclude the password from the response
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export {registerUser,loginUser,userData, logoutUser, updateUser}