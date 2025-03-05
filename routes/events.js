const express = require('express');
const {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEvent,
  updateEvent,
} = require('../controllers/eventController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// api/events
router.get('/', getAllEvents);
router.get('/:id', getEvent);
router.post('/', authenticate, createEvent);
router.put('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);

module.exports = router;
