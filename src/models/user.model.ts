import { MongoEntity } from './mongoEntity.model'

export enum UserStatus {
    ACTIVE = 'active',
    PENDING = 'pending',
    BLOCKED = 'blocked'
}

export interface User extends MongoEntity {
    name: string
    email: string
    status: string
}

export type UserPatchPayload = {
    [key: string]: UserStatus
}

export interface APIUser {
    id: string
    name: string
    email: string
    status: string
}

export class APIUser implements APIUser {
    public static fromEntity(entity: User): APIUser {
        return {
            id: entity._id,
            name: entity.name,
            email: entity.email,
            status: entity.status
        }
    }
}
