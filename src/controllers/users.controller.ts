import {
    Controller,
    Route,
    Get,
    Tags,
    Post,
    Query,
    Body,
    Patch,
    Delete,
    Path,
    OperationId
} from 'tsoa'
import { UsersService, GroupsService } from '../services'
import { APIError, APIUser, QueryPayload, UserPatchPayload } from '../models'

@Tags('Users')
@Route('/users')
export class UsersController extends Controller {
    public usersService: UsersService = new UsersService()
    public groupsService: GroupsService = new GroupsService()

    @Get('/')
    @OperationId('List Users')
    public async list(
        @Query() page: number = 0,
        @Query() limit: number = 1000
    ): Promise<APIUser[]> {
        const users = await this.usersService.list(page, limit)
        const apiEntities = users.map((user) => APIUser.fromEntity(user))

        return apiEntities
    }

    @Post('/query')
    @OperationId('Query Users')
    public async query(@Body() payload: QueryPayload): Promise<APIUser[]> {
        if (!payload.email && !payload.name) {
            throw new APIError('Cannot query by both email and name', 400)
        }

        if (payload.email && payload.name) {
            throw new APIError('Cannot query by both email and name', 400)
        }

        const users = await this.usersService.query(payload)
        const apiEntities = users.map((user) => APIUser.fromEntity(user))

        return apiEntities
    }

    @Patch('/')
    @OperationId('Update Users')
    public async update(@Body() payload: UserPatchPayload): Promise<APIUser[]> {
        const users = await this.usersService.update(payload)
        const apiEntities = users.map((user) => APIUser.fromEntity(user))
        return apiEntities
    }

    @Delete('/{id}/group/{groupId}')
    @OperationId('Remove User from Group')
    public async leaveGroup(
        @Path('id') id: string,
        @Path('groupId') groupId: string
    ): Promise<void> {
        await this.groupsService.removeUserFromGroup(id, groupId)
    }
}
