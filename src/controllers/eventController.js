import express from 'express'
import {Event} from '../models/eventModel.js'

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

        const newEvent=new Event({...req.body,head:userId})
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