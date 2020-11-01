import { Request, Response } from 'express'
import { Database } from '../database'

import { INote, INoteTag } from '../interface/post'

// INIT DATABASE
const database = new Database()

//#region Note
export  const getNote = async (req: Request, res: Response) => {
    let [result_status, result_msg] = await database.getNote(req.query)
    if (!result_status){
        return res.status(403).json({error: result_msg})
    }
    return res.json({msg: result_msg})
}

export const createNote = async (req: Request, res: Response) => {
    // Check data
    if (!req.body.title) return res.status(404).json({error: 'not found >> title << please check'})
    else if (!req.body.content) return res.status(404).json({error: 'not found >> content << please check'})

    // Filter data
    let createNoteData: INote = {
        title: req.body.title,
        content: req.body.content
    }

    // CREATE NOTE
    let [result_status, result_msg] = await database.createNote(createNoteData)
    if (!result_status){
        return res.status(403).json({error: result_msg})
    }

    return res.json({msg: 'Create Note success'})
}

export const editNote = async (req: Request, res: Response) => {
    // Check data
    if (!req.body.id) return res.status(404).json({error: 'not found >> id << please check'})
    else if (!req.body.title) return res.status(404).json({error: 'not found >> title << please check'})
    else if (!req.body.content) return res.status(404).json({error: 'not found >> content << please check'})

    // Filter data
    let editNoteData: INote = {
        title: req.body.title,
        content: req.body.content
    }
    let editNoteID: string = req.body.id

    // CREATE NOTE
    let [result_status, result_msg] = await database.editNote(editNoteID, editNoteData)
    if (!result_status){
        return res.status(403).json({error: result_msg})
    }

    return res.json({msg: 'Edit Note success'})
}

export const deleteNote = async (req: Request, res: Response) => {
    // Check data
    if (!req.query.id) return res.status(404).json({error: 'not found >> id << please check'})

    // Filter data
    let deleteNoteID: string = req.query.id.toString()

    // DELETE NOTE
    let [result_status, result_msg] = await database.deleteNote(deleteNoteID)
    if (!result_status){
        return res.status(403).json({error: result_msg})
    }

    return res.json({msg: 'Delete Note success'})
}
//#endregion

//#region Tag
export const getTags = async (req: Request, res: Response) => {
    let [result_status, result_msg] = await database.getTags(req.query)
    if (!result_status){
        return res.status(403).json({error: result_msg})
    }
    return res.json({msg: result_msg})
}

export const editTags = async (req: Request, res: Response) => {
    // Check data
    if (!req.body.name) return res.status(404).json({error: 'not found >> name << please check'})
    else if (!req.body.new_name) return res.status(404).json({error: 'not found >> new name << please check'})

    // Filter data
    let editTagsData = {
        name: req.body.new_name,
    }

    // CREATE NOTE
    let [result_status, result_msg] = await database.editTags(req.body.name, editTagsData)
    if (!result_status){
        return res.status(403).json({error: result_msg})
    }

    return res.json({msg: 'Edit Tags success'})
}

export const createTags = async (req: Request, res: Response) => {
    // Check data
    if (!req.body.name) return res.status(404).json({error: 'not found >> name << please check'})

    // Filter data
    let createTagsData = {
        name: req.body.name
    }

    let [result_status, result_msg] = await database.getTags(createTagsData)
    if (!result_status){
        return res.status(403).json({error: result_msg})
    }
    // There is no old tag
    if (!result_msg.length){
        // CREATE NOTE
        [result_status, result_msg] = await database.createTags(createTagsData)
        if (!result_status){
            return res.status(403).json({error: result_msg})
        }
        return res.status(403).json({msg: result_msg})
    }
    return res.status(403).json({error: 'Duplicate tag plaes check'})
}



export const deleteTags = async (req: Request, res: Response) => {
    // Check data
    if (!req.query.name) return res.status(404).json({error: 'not found >> name << please check'})

    // Filter data
    let deleteTagID: string = req.query.name.toString()

    // DELETE NOTE
    let [result_status, result_msg] = await database.deleteTags(deleteTagID)
    if (!result_status){
        return res.status(403).json({error: result_msg})
    }

    return res.json({msg: result_msg})
}
//#endregion

export const mapNoteTage = async (req: Request, res: Response) => {
    // CHECK DATA
    if (!req.body.noteID) return res.status(404).json({error: 'not found noteID please check'})
    else if (!req.body.tagID) return res.status(404).json({error: 'not found tagID please check'})

    let [result_status, result_msg] = await database.mapNoteTag(req.body)
    if (!result_status){
        return res.status(403).json({error: result_msg})
    }
    return res.json({msg: result_msg})
}