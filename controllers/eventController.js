const fs = require('fs');
let dataFilePath = './DB/eventData.json';


// read event
const readEventsFromFile = () => {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

// write event
const writeEventsToFile = (events) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(events, null, 2));
};

// all events
const getAllEvents = (req, res) => {
    try {
        const events = readEventsFromFile();
        res.status(200).json(events);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// get by id
const getEvent = (req, res) => {
    try {
        const eventId = req.params.id;
        const events = readEventsFromFile();
        const event = events.find(event => event.id === eventId);

        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        res.status(200).json(event);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// new event
const createEvent = (req, res) => {
    try {
        const userId = req.user.id;

        const newEvent = {
            id: Date.now().toString(),
            ...req.body,
            createdBy: userId,
        };

        const events = readEventsFromFile();
        events.push(newEvent);
        writeEventsToFile(events);

        res.status(201).send("Event added");
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

//update event
const updateEvent = (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = req.params.id;
        const events = readEventsFromFile();
        const eventIndex = events.findIndex(event => event.id === eventId);

        if (eventIndex === -1) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        if (events[eventIndex].createdBy !== userId) {
            res.status(403).json({ message: "You do not have permission to update this event" });
            return;
        }

        const updatedEvent = { ...events[eventIndex], ...req.body };
        events[eventIndex] = updatedEvent;
        writeEventsToFile(events);

        res.status(200).json(updatedEvent);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// delete event
const deleteEvent = (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = req.params.id;
        const events = readEventsFromFile();
        const eventIndex = events.findIndex(event => event.id === eventId);
        if (eventIndex === -1) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        if (events[eventIndex].createdBy !== userId) {
            res.status(403).json({ message: "You do not have permission to delete this event" });
            return;
        }
        events.splice(eventIndex, 1);
        writeEventsToFile(events);
        res.status(200).json({ message: "Event deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getAllEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
};