import { MongoEntity } from './mongoEntity.model'

export enum GroupStatus {
    EMPTY = 'empty',
    NOT_EMPTY = 'notEmpty',
}

export interface Group extends MongoEntity {
    name: string
    description: string
    members: string[]
    status: GroupStatus
}
