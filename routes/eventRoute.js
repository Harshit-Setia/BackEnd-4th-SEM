const {Router}=require('express')
const {getAllEvent,getEvent,createEvent,updateEvent,deleteEvent,registerEvent}=require('../controllers/eventController.js')
const auth=require('../middleware/auth.js')

const router=Router()

// api/events
router.get('/',getAllEvent)
router.get('/:id',getEvent)
router.post('/',auth,createEvent)
router.put('/:id',auth,updateEvent)
router.put('/:id/register',auth,registerEvent)
router.delete('/:id',auth,deleteEvent)


module.exports=router