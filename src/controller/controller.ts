import { Request, Response } from 'express'
import { Database } from '../database'

import { INote } from '../interface/post'

// INIT DATABASE
const database = new Database()


export  const getNote = async (req: Request, res: Response) => {
    let [result_status, result_msg] = await database.getNote(req.params.noteId)
    if (!result_status){
        return res.status(403).json({error: result_msg})
    }
    return res.json({msg: result_msg})
}

export const createNote = async (req: Request, res: Response) => {
    let [result_status, result_msg] = await database.createNote(req.body)
    if (!result_status){
        return res.status(403).json({error: result_msg})
    }
    return res.json({msg: result_msg})
}