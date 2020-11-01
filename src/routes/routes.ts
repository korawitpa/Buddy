import { Router } from 'express'
import { getNote, createNote, getTags, mapNoteTage, createTags, editNote, deleteNote } from '../controller/controller'

const router = Router()

router.route('/')
    .get(getNote)
    .post(createNote)
    .put(editNote)
    .delete(deleteNote)   

router.route('/tags')
    .get(getTags)
    .post(createTags)

router.route('/map')
    .put(mapNoteTage)
export default router