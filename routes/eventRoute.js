const {Router}=require('express')
const {getAllEvent,getEvent,createEvent,updateEvent,deleteEvent}=require('../controllers/eventController.js')
const auth=require('../middleware/auth.js')

const router=Router()

// api/events
router.get('/',getAllEvent)
router.get('/:id',getEvent)
router.post('/',auth,createEvent)
router.put('/:id',auth,updateEvent)
router.delete('/:id',auth,deleteEvent)


module.exports=router