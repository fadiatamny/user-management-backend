import { MongoClient, Db } from 'mongodb'
import { config } from '../config'

export class Mongo {
    private static _client: MongoClient
    public static db: Db

    public static async connect(uri: string): Promise<void> {
        this._client = new MongoClient(uri)

        try {
            await this._client.connect()
        } catch (e) {
            throw Error('Unable to connect to the database')
        }

        this.db = this._client.db(config.MONGO.db)
    }
}
