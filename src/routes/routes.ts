import { Router } from 'express'
import { welcome } from '../controller/controller'

const router = Router()

router.route('/')
    .get(welcome)

export default router