import { Router } from 'express'
import { getNote, createNote } from '../controller/controller'

const router = Router()

router.route('/')
    .get(getNote)
    .post(createNote)

router.route('/:noteId')
    .get(getNote)

export default router