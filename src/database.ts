import { query } from 'express'
import { createPool } from 'mysql'
import { INote, ISort, INoteTag } from './interface/post'

export class Database {
    constructor() {}

    private connection = createPool({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'buddy',
        connectionLimit : 2,
    })

    public getNote = (queryParams?: any): Promise<[boolean, any]> => {
        return new Promise((resolve) => {
            this.connection.getConnection((err, connection)=> {
                if (err) resolve([false, err])
                else{
                    let query = "SELECT n.*, GROUP_CONCAT(t.name) AS tags FROM note as n LEFT JOIN note_tags as nt ON n.noteID=nt.noteID LEFT JOIN tags as t ON t.tagID=nt.tagID"

                    // Get data by column query
                    if (queryParams.search_column) {
                        if (queryParams.search_data)
                        {
                            if (queryParams.search_column == 'id')
                                query += ` WHERE n.noteID=${queryParams.search_data}`
                            else if (queryParams.search_column == 'tags')
                                query += ` WHERE t.name='${queryParams.search_data}'`
                            else
                                query += ` WHERE n.${queryParams.search_column} LIKE '%${queryParams.search_data}%'`
                        }
                        else resolve([false, 'IF YOU WANNA USE SEARCH BY COLUMN PLEASE ADD PARAM => search_data'])
                    }

                    query += " GROUP BY n.noteID"

                    // Sort data query
                    if (queryParams.sort_column) {
                        if (queryParams.sort_direction){
                            if (queryParams.sort_column == 'id') queryParams.sort_column = 'noteID'
                            query += ` ORDER BY n.${queryParams.sort_column} ${queryParams.sort_direction}`
                        }
                            
                        else resolve([false, 'IF YOU WANNA USE SORT BY COLUMN PLEASE ADD PARAM => sort_direction'])
                    }
                    const select = this.connection.query(query, (err, result) => {
                        this.connection.releaseConnection(connection)  // Disconnect database
                        if (err){
                            resolve([false, err])
                        }
                        else{
                            result.forEach((element:any) => {
                                if (element.tags)
                                    element.tags = element.tags.split(',')
                                else element.tags = []
                            })
                            result.forEach((element:any) => {
                                // Convert key name
                                element.id = element.noteID
                                // Remove old key name
                                delete element.noteID
                            })
                            resolve([true, result])
                        }
                    })
                }
                
            })
        })
    }

    public createNote = (note_detail: INote): Promise<[boolean, any]> => {
        return new Promise((resolve) => {
            let newNote:INote = note_detail
            newNote.createdAt = new Date
            this.connection.getConnection((err, connection) => {
                if (err) resolve([false, err])
                else {
                    const select = this.connection.query("INSERT INTO note SET ?", [newNote], (err, result)=>{
                        this.connection.releaseConnection(connection)  // Disconnect database
                        if (err){
                            resolve([false, err])
                        }
                        else{
                            resolve([true, 'Create new note success'])
                        }
                    })
                }
            })
        })
    }

    public editNote = (note_id: string, note_detail: INote): Promise<[boolean, any]> => {
        return new Promise((resolve) => {
            let editNote:INote = note_detail
            this.connection.getConnection((err, connection) => {
                if (err) resolve([false, err])
                else {
                    // CHECK IS THERE DATA BY NOTE ID
                    let select = this.connection.query("SELECT * FROM note WHERE noteID=?", [note_id], (err, result)=>{
                        if (err){
                            this.connection.releaseConnection(connection)  // Disconnect database
                            resolve([false, err])
                        }
                        else{
                            // IF THERE IS NO DATA
                            if (!result.length){
                                this.connection.releaseConnection(connection)  // Disconnect database
                                resolve([false, 'Not found exitting note please check'])
                            }
                            else{
                                // UPDATE NOTE
                                select = this.connection.query("UPDATE note SET ? WHERE noteID=?", [editNote, note_id], (err, result)=>{
                                    this.connection.releaseConnection(connection)  // Disconnect database
                                    if (err){
                                        resolve([false, err])
                                    }
                                    else{
                                        resolve([true, 'Create edit note success'])
                                    }
                                })
                            }
                        }
                    })
                }
            })
        })
    }

    public deleteNote = (note_id: string): Promise<[boolean, any]> => {
        return new Promise((resolve) => {
            this.connection.getConnection((err, connection) => {
                if (err) resolve([false, err])
                else {
                    // CHECK IS THERE DATA BY NOTE ID
                    let select = this.connection.query("SELECT * FROM note WHERE noteID=?", [note_id], (err, result)=>{
                        if (err){
                            this.connection.releaseConnection(connection)  // Disconnect database
                            resolve([false, err])
                        }
                        else{
                            // IF THERE IS NO NOTE DATA
                            if (!result.length){
                                this.connection.releaseConnection(connection)  // Disconnect database
                                resolve([false, 'Not found exitting note please check'])
                            }
                            else{
                                // CHECK IS THERE note_tags
                                select = this.connection.query("SELECT * FROM note_tags WHERE noteID=?", [note_id], (err, result)=>{
                                    if (err){
                                        this.connection.releaseConnection(connection)  // Disconnect database
                                        resolve([false, err])
                                    }
                                    else{
                                        if (result.length > 0) {
                                            // DELETE note_tags
                                            select = this.connection.query("DELETE FROM note_tags WHERE noteID=?", [note_id], (err, result)=>{
                                                if (err){
                                                    this.connection.releaseConnection(connection)  // Disconnect database
                                                    resolve([false, err])
                                                }
                                                else{
                                                    // DELETE NOTE
                                                    select = this.connection.query("DELETE FROM note WHERE noteID=?", [note_id], (err, result)=>{
                                                        this.connection.releaseConnection(connection)  // Disconnect database
                                                        if (err){
                                                            resolve([false, err])
                                                        }
                                                        else{
                                                            resolve([true, 'Delete note success'])
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                        else {
                                            // DELETE NOTE
                                            select = this.connection.query("DELETE FROM note WHERE noteID=?", [note_id], (err, result)=>{
                                                this.connection.releaseConnection(connection)  // Disconnect database
                                                if (err){
                                                    resolve([false, err])
                                                }
                                                else{
                                                    resolve([true, 'Delete note success'])
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            })
        })
    }

    public getTags = (tag?: any): Promise<[boolean, any]> => {
        return new Promise((resolve) => {
            this.connection.getConnection((err, connection)=> {
                if (err) resolve([false, err])
                else {
                    let query = "SELECT * FROM tags"
                    if (tag.name) query += ` WHERE name='${tag.name}'`
                    const select = this.connection.query(query, (err, result) => {
                        this.connection.releaseConnection(connection)  // Disconnect database
                        if (err){
                            resolve([false, err])
                        }
                        else{
                            resolve([true, result])
                        }
                    })
                }
            })
        })
    }

    public createTags = (tag?: {}): Promise<[boolean, any]> => {
        return new Promise((resolve) => {
            this.connection.getConnection((err, connection) => {
                if (err) resolve([false, err])
                else {
                    const select = this.connection.query("INSERT INTO tags SET ?", [tag], (err, result)=>{
                        this.connection.releaseConnection(connection)  // Disconnect database
                        if (err){
                            resolve([false, err])
                        }
                        else{
                            resolve([true, 'Create new tag success'])
                        }
                    })
                }
            })
        })
    }

    public editTags = (tag_name: string, new_tag_name: any): Promise<[boolean, any]> => {
        return new Promise((resolve) => {
            this.connection.getConnection((err, connection) => {
                if (err) resolve([false, err])
                else {
                    // CHECK IS THERE DATA BY TAGS NAME
                    let select = this.connection.query("SELECT * FROM tags WHERE name=?", [tag_name], (err, result)=>{
                        if (err){
                            this.connection.releaseConnection(connection)  // Disconnect database
                            resolve([false, err])
                        }
                        else{
                            // IF THERE IS NO DATA
                            if (!result.length){
                                this.connection.releaseConnection(connection)  // Disconnect database
                                resolve([false, 'Not found exitting tags please check'])
                            }
                            else{
                                // CHECK DUPLICATE TAGS
                                select = this.connection.query("SELECT * FROM tags WHERE name=?", [new_tag_name.name], (err, result)=>{
                                    if (err){
                                        this.connection.releaseConnection(connection)  // Disconnect database
                                        resolve([false, err])
                                    }
                                    else {
                                        if (result.length > 0) {
                                            this.connection.releaseConnection(connection)  // Disconnect database
                                            resolve([false, 'Duplicate tags do not use this new tags'])
                                        }
                                        else{
                                            // UPDATE TAGS
                                            select = this.connection.query("UPDATE tags SET ? WHERE name=?", [new_tag_name, tag_name], (err, result)=>{
                                                this.connection.releaseConnection(connection)  // Disconnect database
                                                if (err){
                                                    resolve([false, err])
                                                }
                                                else{
                                                    resolve([true, 'Edit tags success'])
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            })
        })
    }

    public deleteTags = (tag_name: string): Promise<[boolean, any]> => {
        return new Promise((resolve) => {
            this.connection.getConnection((err, connection)=> {
                if (err) resolve([false, err])
                else {
                    // CHECK IS THERE EXITTING TAG
                    let select = this.connection.query("SELECT * FROM tags WHERE name=?", [tag_name], (err, result) => {
                        if (err){
                            this.connection.releaseConnection(connection)  // Disconnect database
                            resolve([false, err])
                        }
                        else{
                            // IF THERE IS EXITTING TAG
                            if (result.length > 0){
                                let tag_id = result[0].tagID
                                // CHECK IS THERE note_tags
                                select = this.connection.query("SELECT * FROM note_tags WHERE tagID=?", [tag_id], (err, result) => {
                                    if (err){
                                        this.connection.releaseConnection(connection)  // Disconnect database
                                        resolve([false, err])
                                    }
                                    else {
                                        // IF THERE IS EXITTING note_tags
                                        if (result.length > 0) {
                                            // DELETE note_tags
                                            select = this.connection.query("DELETE FROM note_tags WHERE tagID=?", [tag_id], (err, result)=>{
                                                if (err){
                                                    this.connection.releaseConnection(connection)  // Disconnect database
                                                    resolve([false, err])
                                                }
                                                else{
                                                    // DELELTE TAGS
                                                    select = this.connection.query("DELETE FROM tags WHERE tagID=?", [tag_id], (err, result)=>{
                                                        this.connection.releaseConnection(connection)  // Disconnect database
                                                        if (err){
                                                            resolve([false, err])
                                                        }
                                                        else{
                                                            resolve([false, 'Delete tags success'])
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                        select = this.connection.query("DELETE FROM tags WHERE tagID=?", [tag_id], (err, result)=>{
                                            this.connection.releaseConnection(connection)  // Disconnect database
                                            if (err){
                                                resolve([false, err])
                                            }
                                            else{
                                                resolve([false, 'Delete tags success'])
                                            }
                                        })
                                    }
                                })
                            }
                            else {
                                this.connection.releaseConnection(connection)  // Disconnect database
                                resolve([false, 'Not found tags please check'])
                            }
                        }
                    })
                }
            })
        })
    }

    public mapNoteTag = (note_tag: INoteTag): Promise<[boolean, any]> => {
        return new Promise((resolve) => {

            this.connection.getConnection((err, connection) => {
                if (err) resolve([false, err])
                else {
                    // CHECK THERE IS NOTE DATA
                    let select = this.connection.query(`SELECT * FROM note WHERE noteID='${note_tag.noteID}'`, (err, result) => {
                        if (err){
                            this.connection.releaseConnection(connection)  // Disconnect database
                            resolve([false, err])
                        }
                        else{
                            if (result.length)
                                // CHECK THERE IS TAG DATA
                                select = this.connection.query(`SELECT * FROM tags WHERE tagID='${note_tag.tagID}'`, (err, result) => {
                                    if (err){
                                        this.connection.releaseConnection(connection)  // Disconnect database
                                        resolve([false, err])
                                    }
                                    else{
                                        if (result.length){
                                            // MAP note_tags ==>> CHECK EXITTING DATA
                                            select = this.connection.query(`SELECT * FROM note_tags WHERE noteID='${note_tag.noteID}' AND tagID='${note_tag.tagID}'`, (err, result) => {
                                                if (err){
                                                    this.connection.releaseConnection(connection)  // Disconnect database
                                                    resolve([false, err])
                                                }
                                                else {
                                                    if (!result.length){
                                                        select = this.connection.query("INSERT INTO note_tags SET ?", [note_tag], (err, result)=>{
                                                            if (err){
                                                                this.connection.releaseConnection(connection)  // Disconnect database
                                                                resolve([false, err])
                                                            }
                                                            else{
                                                                this.connection.releaseConnection(connection)  // Disconnect database
                                                                resolve([true, 'Create map note - tag success'])
                                                            }
                                                        })
                                                    }
                                                    else {
                                                        this.connection.releaseConnection(connection)  // Disconnect database
                                                        resolve([false, 'Found exitting note_tags please check'])
                                                    }
                                                }
                                            })
                                        }
                                        else {
                                            this.connection.releaseConnection(connection)  // Disconnect database
                                            resolve([false, 'Not found Tag please check'])
                                        }
                                    }
                                })
                            else 
                            {
                                this.connection.releaseConnection(connection)  // Disconnect database
                                resolve([false, 'Not found Note please check'])
                            }
                        }
                    })
                }
            })
        })
    }

    public deleteNoteTag = (noteID:string, tagID:string): Promise<[boolean, any]> => {
        return new Promise((resolve) => {
            this.connection.getConnection((err, connection) => {
                if (err) resolve([false, err])
                else {
                    // CHECK IS THERE DATA
                    let select = this.connection.query("SELECT * FROM note_tags WHERE noteID=? AND TagID=?", [noteID, tagID], (err, result)=>{
                        if (err){
                            this.connection.releaseConnection(connection)  // Disconnect database
                            resolve([false, err])
                        }
                        else{
                            // IF THERE IS NO DATA
                            if (!result.length){
                                this.connection.releaseConnection(connection)  // Disconnect database
                                resolve([false, 'Not found exitting note_tags please check'])
                            }
                            else{
                                // DELETE note_tags
                                select = this.connection.query("DELETE FROM note_tags WHERE noteID=? AND TagID=?", [noteID, tagID], (err, result)=>{
                                    this.connection.releaseConnection(connection)  // Disconnect database
                                    if (err){
                                        resolve([false, err])
                                    }
                                    else{
                                        resolve([true, 'Delete note_tags success'])
                                    }
                                })
                            }
                        }
                    })
                }
            })
        })
    }
}