import express from 'express'
import {Event} from '../models/eventModel.js'
import {uplodOnCloudinary} from '../utils/fileUplode.js'

// get all event
const getAllEvent= async (req,res)=>{
    try {
        
        const events=await Event.find()
        res.status(200).json(events)

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

// get event by id
const getEvent= async (req,res)=>{
    try {
        
        const eventId=req.params.id
        const event=await Event.findById(eventId)

        if(!event){
            res.status(404).json({message:"Event not Found"})
            return
        }
        res.status(200).json(event)

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

// create new event
const createEvent= async (req,res)=>{
    try {
        
        const userId=req.user.id
        const {name,date,location,desc}=req.body;
        if([name,date,location,desc].some((field)=>field?.trim()==="")){
            res.status(400).json({message:` ${field} can't be empty`});
            return;
        }
        const existingEvent=await Event.findOne({name})
        if(existingEvent){
            res.status(409).json({message:"Event already exisits"})
            return
        }
        const posterLocalpath=req.file?.path;
        if(!posterLocalpath){
            res.status(400).json({message:"Poster is required"})
        }
        const poster=await uplodOnCloudinary(posterLocalpath);
        if(!poster){
            res.status(500).json({message:"Cloudinary Error"});
        }
        const newEvent=new Event({
            name,
            date,
            location,
            desc,
            poster:poster.url,
            head:userId
        })
        const savedEvent=await newEvent.save()

        res.status(201).json(savedEvent)

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

// update event
const updateEvent= async (req,res)=>{
    try {
        
        const userId=req.user.id

        const event=await Event.findById(req.params.id)

        if(!event){
            res.status(404).json({message:"Event not found"})
            return
        }

        if(event.head.toString()!==userId){
            res.status(403).json({message:"You donot have permission to update this event"})
            return
        }

        const updatedEvent=await Event.findByIdAndUpdate(req.params.id, req.body,{new:true})

        res.status(204).json(updatedEvent)

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

//regester/un-regester
const registerEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = req.params.id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const attendeeIndex = event.attendees.indexOf(userId);

        if (attendeeIndex === -1) {
            // User is not registered, so register them
            event.attendees.push(userId);
            await event.save();
            return res.status(200).json({ message: "Registered successfully" });
        } else {
            // User is already registered, so unregister them
            event.attendees.splice(attendeeIndex, 1);
            await event.save();
            return res.status(200).json({ message: "Unregistered successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// delete events
const deleteEvent= async (req,res)=>{
    try {
        
        const userId=req.user.id

        const event=await Event.findById(req.params.id)

        if(!event){
            res.status(404).json({message:"Event not found"})
            return
        }

        if(event.head.toString()!==userId){
            res.status(403).json({message:"You donot have permission to update this event"})
            return
        }

        await Event.findByIdAndDelete(req.params.id)

        res.status(200).json({message:"Event Deleted"})

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export {getAllEvent,getEvent,createEvent,updateEvent,deleteEvent,registerEvent}