import { createPool } from 'mysql'
import { INote } from './interface/post'

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

    public getNote = (noteID?: string): Promise<[boolean, any]> => {
        return new Promise((resolve) => {
            this.connection.getConnection((err, connection)=> {
                if (err) resolve([false, err])
                else{
                    let query = "SELECT * FROM node"
                    if (noteID) query += ` WHERE ID=${noteID}`
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

    public createNote = (note_detail: INote): Promise<[boolean, any]> => {
        return new Promise((resolve) => {
            let newNote:INote = note_detail
            newNote.CreateAt = new Date
            this.connection.getConnection((err, connection) => {
                if (err) resolve([false, err])
                else {
                    const select = this.connection.query("INSERT INTO node SET ?", [newNote], (err, result)=>{
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
}