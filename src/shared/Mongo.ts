import { MongoClient, Db } from 'mongodb'
import { config } from '../config'

export class Mongo {
    public static client: MongoClient
    public static db: Db

    public static async connect(uri: string): Promise<void> {
        this.client = new MongoClient(uri)

        try {
            await this.client.connect()
        } catch (e) {
            throw Error('Unable to connect to the database')
        }

        this.db = this.client.db(config.MONGO.db)
    }
}
