const express=require('express')
const jwt=require('jsonwebtoken')

const auth = (req,res,next)=>{
    const token = req.headers.authorization.split(" ")[1]
    if(!token){
        res.status(401).json({message:"Access denied"})
        return
    }

    try{
        if(!process.env.JWT_SECRET){
            res.status(500).json({message:"contact admin"})
            return
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)

        req.user=decoded

        next()
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
}

module.exports=auth