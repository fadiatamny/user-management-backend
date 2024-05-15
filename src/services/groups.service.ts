import { Collection } from 'mongodb'
import { APIError, Group, GroupStatus } from '../models'
import { Mongo } from '../shared'

export class GroupsService {
    public get collection(): Collection<Group> {
        return Mongo.db.collection('groups')
    }

    public async removeUserFromGroup(
        userId: string,
        groupId: string
    ): Promise<void> {
        const group = await this.collection.findOne({ _id: groupId })

        if (!group) {
            throw new APIError('User not found in group', 404)
        }

        const updatedMembers = group.members.filter(
            (member) => member !== userId
        )
        if (updatedMembers.length === group.members.length) {
            throw new APIError('User not found in group', 404)
        }

        group.members = updatedMembers

        if (updatedMembers.length === 0) {
            group.status = GroupStatus.EMPTY
        }

        try {
            await this.collection.updateOne({ _id: groupId }, { $set: group })
        } catch (e) {
            throw new APIError('Failed to remove user from group', 500, e)
        }
    }
}
