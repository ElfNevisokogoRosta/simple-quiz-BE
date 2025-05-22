import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { userCreateDTO, UserCreateDTO } from 'src/user/user.dto';
import { AuthDTO } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from 'src/common/pipes/zod_validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @Post('login')
  async signIn(@Body() user: AuthDTO) {
    return await this.authServices.signIn(user);
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(userCreateDTO))
  async signUp(@Body() user: UserCreateDTO) {
    return await this.authServices.signUp(user);
  }

  @Get('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Req() req: any) {
    const { user } = req;
    return await this.authServices.refreshToken(user);
  }
}
