const {Router}=require('express')
const {getAllEvent,getEvent,createEvent,updateEvent,deleteEvent}=require('../controllers/eventController')


const router=Router()

// api/events
router.get('/',getAllEvent)
router.get('/:id',getEvent)
router.post('/',authenticate,createEvent)
router.put('/:id',authenticate,updateEvent)
router.delete('/:id',authenticate,deleteEvent)


module.exports=router