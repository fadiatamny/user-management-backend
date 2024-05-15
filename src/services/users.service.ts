import { Collection } from 'mongodb'
import { QueryPayload, User, UserPatchPayload } from '../models'
import { Mongo } from '../shared'

export class UsersService {
    public get collection(): Collection<User> {
        return Mongo.db.collection('users')
    }

    public async list(page: number, limit: number): Promise<User[]> {
        const users = await this.collection
            .find()
            .skip(page * limit)
            .limit(limit)

        return users.toArray()
    }

    public async query(payload: QueryPayload): Promise<User[]> {
        const { email, name } = payload
        let { limit, page } = payload

        limit = limit ?? 1000
        page = page ?? 0

        const filter: { [key: string]: any } = {}
        if (email) {
            filter.email = email
        }
        if (name) {
            filter.name = name
        }

        const users = await this.collection
            .find(filter)
            .skip(page * limit)
            .limit(limit)

        return users.toArray()
    }

    public async update(payload: UserPatchPayload): Promise<User[]> {
        const session = Mongo.client.startSession()

        let result: User[] = []
        let promises = []

        try {
            session.startTransaction()
            const maxBulkSize = 100

            for (const [key, value] of Object.entries(payload)) {
                if (promises.length >= maxBulkSize) {
                    const users = await Promise.all(promises)
                    result = result.concat(users)
                    promises = []
                }

                promises.push(
                    this.collection.findOneAndUpdate(
                        { _id: key },
                        { $set: { status: value } },
                        { returnDocument: 'after' }
                    ) as Promise<User>
                )
            }

            if (promises.length > 0) {
                const users = await Promise.all(promises)
                result = result.concat(users)
            }

            await session.commitTransaction()
            return result
        } catch (e) {
            await session.abortTransaction()
            throw e
        } finally {
            await session.endSession()
        }
    }
}
