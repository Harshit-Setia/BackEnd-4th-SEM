import {Router} from 'express'
import {getAllEvent,getEvent,createEvent,updateEvent,deleteEvent,registerEvent} from '../controllers/eventController.js'
import {auth} from '../middleware/auth.js'
import {upload} from '../middleware/multer.js'

const router=Router()

// api/events
router.get('/',getAllEvent)
router.get('/:id',getEvent)
router.post('/create',auth,upload.single("poster"),createEvent)
router.put('/:id',auth,updateEvent)
router.put('/:id/register',auth,registerEvent)
router.delete('/:id',auth,deleteEvent)


export const eventRoute=router