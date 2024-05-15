import { MongoClient, Db } from 'mongodb'
import { config } from '../config'

export class Mongo {
    public static client: MongoClient
    public static db: Db

    private static async createIndexes(): Promise<void> {
        try {
            let collection = this.db.collection('users')
            await collection.createIndex({ email: 1 }, { background: true }) // could be unique if needed
            await collection.createIndex({ name: 1 }, { background: true })
        } catch (error) {
            throw Error('Unable to create indexes')
        }
    }

    public static async connect(uri: string): Promise<void> {
        this.client = new MongoClient(uri)

        try {
            await this.client.connect()
        } catch (e) {
            throw Error('Unable to connect to the database')
        }

        this.db = this.client.db(config.MONGO.db)

        await this.createIndexes()
    }
}
