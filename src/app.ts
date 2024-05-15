import dotenv from 'dotenv'
import express, { Express } from 'express'
import { config } from './config'
import { Mongo } from './shared/Mongo'
import { RegisterRoutes } from './routes'
import bodyParser from 'body-parser'
import { errorMiddleware, unknownMiddleware } from './middlewares'
import { logger } from './shared/Logger'

dotenv.config()

async function main() {
    const app: Express = express()

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use((req, res, next) => {
        logger.info(`${req.method} ${req.url}`)
        next()
    })

    try {
        await Mongo.connect(config.MONGO.uri)
        RegisterRoutes(app)

        app.use(errorMiddleware)
        app.use(unknownMiddleware)

        app.listen(config.PORT, () => {
            logger.info(`Server running on port ${config.PORT}`)
        })
    } catch (e) {
        logger.error('Unable to start the server', e)
        process.exit(1)
    }
}

main()
