import { Request, Response } from 'express'
import {connectDatabase} from '../database'

import { newNote } from '../interface/post'

export  const getNote = (req: Request, res: Response) => {
    connectDatabase().connect((err, result) => {
        if (err) return res.json(err)
        else {
            const select = connectDatabase().query("SELECT * FROM node", (err, result)=>{
                connectDatabase().end()  // Disconnect database
                if (err){
                    return res.json(err)
                }
                else{
                    return res.json(result)
                }
            })
        }
    })
}

export const createNote = (req: Request, res: Response) => {
    const newNote: newNote = req.body
    newNote.CreateAt = new Date
    connectDatabase().connect((err, result) => {
        if (err) return res.json(err)
        else {
            const select = connectDatabase().query("INSERT INTO node SET ?", [newNote], (err, result)=>{
                connectDatabase().end()  // Disconnect database
                if (err){
                    return res.json(err)
                }
                else{
                    return res.json({message: 'Create new note success'})
                }
            })
        }
    })
}