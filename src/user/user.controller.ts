import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { userUpdateDTO, UserUpdateDTO } from './user.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod_validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { SearchParams } from 'src/common/types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async getUser(@Query() query: SearchParams) {
    const ids = Array.isArray(query.ids)
      ? query.ids
      : typeof query.ids === 'undefined'
        ? undefined
        : [query.ids];
    return await this.userService.getAll(
      +query.skip,
      +query.take,
      ids,
      query.searchQ,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(userUpdateDTO)) data: UserUpdateDTO,
  ) {
    return await this.userService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteUser(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
