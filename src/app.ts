import express , { Application } from 'express';
import Routes from './routes/routes'

export class App {

    app: Application

    constructor(private port: number) {
        this.app = express()
        this.middlewares()
        this.routes()
        
    }

    routes() {
        this.app.use(Routes)
    }

    middlewares() {
        this.app.use(express.json())
    }

    async listen() {
        await this.app.listen(this.port)
        console.log('Server start on port ',this.port)
    }
}