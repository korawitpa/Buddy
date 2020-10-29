import express , { Application } from 'express';
import Routes from './routes/routes'

export class App {

    app: Application

    constructor(private port: number) {
        this.app = express()
        this.routes()
    }

    routes() {
        this.app.use(Routes)
    }

    async listen() {
        await this.app.listen(this.port)
        console.log('Server start on port ',this.port)
    }
}