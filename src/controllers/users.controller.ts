import { Controller, Route, Get, Tags, Post, Query, Body, Patch } from 'tsoa'
import { UsersService } from '../services'
import { APIUser, QueryPayload, UserPatchPayload } from '../models'

@Tags('Users')
@Route('/users')
export class UsersController extends Controller {
    public service: UsersService = new UsersService()

    @Get('/')
    public async list(
        @Query() page: number = 0,
        @Query() limit: number = 1000
    ): Promise<APIUser[]> {
        const users = await this.service.list(page, limit)
        const apiEntities = users.map((user) => APIUser.fromEntity(user))

        return apiEntities
    }

    @Post('/query')
    public async query(@Body() payload: QueryPayload): Promise<APIUser[]> {
        if (!payload.email && !payload.name) {
            this.setStatus(400)
            return []
        }

        if (payload.email && payload.name) {
            this.setStatus(400)
            return []
        }

        const users = await this.service.query(payload)
        const apiEntities = users.map((user) => APIUser.fromEntity(user))

        return apiEntities
    }

    @Patch('/')
    public async update(@Body() payload: UserPatchPayload): Promise<APIUser[]> {
        const users = await this.service.update(payload)
        const apiEntities = users.map((user) => APIUser.fromEntity(user))
        return apiEntities
    }
}
