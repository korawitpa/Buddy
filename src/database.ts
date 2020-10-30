import { createConnection } from 'mysql'

export const connectDatabase = () => {
    return createConnection({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'buddy'
    })
}