import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import { config } from './config'
import { Mongo } from './shared/Mongo'
import { RegisterRoutes } from './routes'
import bodyParser from 'body-parser'

dotenv.config()

async function main() {
    const app: Express = express()

    try {
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())

        await Mongo.connect(config.MONGO.uri)
        RegisterRoutes(app)

        app.listen(config.PORT, () => {
            console.log(`Server running on port ${config.PORT}`)
        })
    } catch (e) {
        console.error('Unable to start the server', e)
        process.exit(1)
    }
}

main()
