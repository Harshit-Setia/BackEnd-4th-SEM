import express from "express";
import { Event } from "../models/eventModel.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import { User } from "../models/userModel.js";

// get all event
const getAllEvent = async (req, res) => {
  try {
    const events = await Event.find();
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// get event by id
const getEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
    return res.status(404).json({ message: "Event not Found" });
    }
    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// create new event
const createEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, date, location, desc } = req.body;
    if ([name, date, location, desc].some((field) => field?.trim() === "")) {
    return res.status(400).json({ message: ` ${field} can't be empty` });
    }
    const existingEvent = await Event.findOne({ name });
    if (existingEvent) {
    return res.status(409).json({ message: "Event already exisits" });
    }
    const posterLocalpath = req.file?.path;
    if (!posterLocalpath) {
    return res.status(400).json({ message: "Poster is required" });
    }
    const poster = await uploadOnCloudinary(posterLocalpath);
    if (!poster) {
    return res.status(500).json({ message: "Cloudinary Error" });
    }
    const newEvent = new Event({
      name,
      date,
      location,
      desc,
      poster: poster.url,
      head: userId,
    });
    const savedEvent = await newEvent.save();

    return res.status(201).json(savedEvent);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// update event
const updateEvent = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the authenticated user
    const eventId = req.params.id; // Get the event ID from the request parameters
    const { name, date, location, desc } = req.body; // Extract fields from the request body

    const event = await Event.findById(eventId); // Find the event by ID

    if (!event) {
      return res.status(404).json({ message: "Event not found" }); // If event doesn't exist
    }

    // Check if the user is the head of the event
    if (event.head.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to update this event" });
    }

    // Update the event fields if provided in the request body
    if (name) event.name = name;
    if (date) event.date = date;
    if (location) event.location = location;
    if (desc) event.desc = desc;

    // If a new poster is uploaded, update it
    if (req.file?.path) {
      const poster = await uploadOnCloudinary(req.file.path);
      if (!poster) {
        return res.status(500).json({ message: "Cloudinary Error" });
      }
      event.poster = poster.url;
    }

    const updatedEvent = await event.save(); // Save the updated event

    return res.status(200).json(updatedEvent); // Return the updated event
  } catch (error) {
    return res.status(500).json({ error: error.message }); // Handle errors
  }
};

//regester/un-regester
const registerEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event) {
    return res.status(404).json({ message: "Event not found" });
    }
    const attendeeIndex = event.attendees.indexOf(userId);
    const registeredIndex = user.registeredEvent.indexOf(eventId);

    if (attendeeIndex === -1 && registeredIndex === -1) {
      // User is not registered, so register them
      event.attendees.push(userId);
      user.registeredEvent.push(eventId);
      await event.save();
      await user.save();
    return res.status(200).json({ message: "Registered successfully" });
    } else {
      // User is already registered, so unregister them
      event.attendees.splice(attendeeIndex, 1);
      user.registeredEvent.splice(registeredIndex, 1);
      await event.save();
      await user.save();
    return res.status(200).json({ message: "Unregistered successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// delete events
const deleteEvent = async (req, res) => {
  try {
    const userId = req.user.id;

    const event = await Event.findById(req.params.id);

    if (!event) {
    return res.status(404).json({ message: "Event not found" });
    }

    if (event.head.toString() !== userId) {
      res
        .status(403)
        .json({ message: "You donot have permission to update this event" });
    }

    await Event.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Event Deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export {
  getAllEvent,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerEvent,
};
