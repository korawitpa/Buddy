import { Router } from 'express'
import { getNote, createNote, getTags, mapNoteTage, createTags, editNote, deleteNote, deleteTags, editTags, deleteNoteTags } from '../controller/controller'

const router = Router()

router.route('/')
    .get(getNote)
    .post(createNote)
    .put(editNote)
    .delete(deleteNote)   

router.route('/tags')
    .get(getTags)
    .post(createTags)
    .put(editTags)
    .delete(deleteTags)

router.route('/map')
    .put(mapNoteTage)
    .delete(deleteNoteTags)
export default router