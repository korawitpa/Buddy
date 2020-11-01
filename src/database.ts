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
                    const select = this.connection.query("UPDATE note SET ? WHERE noteID=?", [editNote, note_id], (err, result)=>{
                        this.connection.releaseConnection(connection)  // Disconnect database
                        if (err){
                            resolve([false, err])
                        }
                        else{
                            resolve([true, 'Create edit note success'])
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
                                            // MAP NOTE-TAG ==>> CHECK EXITTING DATA
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
                                                        resolve([false, 'Found exitting note-tag please check'])
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
}