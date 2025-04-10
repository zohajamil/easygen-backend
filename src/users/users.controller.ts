import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpException,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticateUserRequestDto } from './dto/req/authenticate-user.req.dto';
import { AuthenticatedUserResponseDto } from './dto/res/authenticated-user.res.dto';
import { CreateUserRequestDto } from './dto/req/create-user.req.dto';
import { User } from './entities/user.entity';
import { ValidateSessionResponseDto } from './dto/res/validate-session.res.dto';
import { DeleteSessionResponseDto } from './dto/res/delete-session.res.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async signUp(
    @Res() response,
    @Body() createUserDto: CreateUserRequestDto,
  ): Promise<AuthenticatedUserResponseDto> {
    try {
      console.log(createUserDto);
      const data = await this.usersService.signUp(createUserDto);
      return response.status(HttpStatus.OK).send(data);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Post('/authenticate')
  async authenticate(
    @Res() response,
    @Body() authenticateUserDto: AuthenticateUserRequestDto,
  ): Promise<AuthenticatedUserResponseDto> {
    try {
      const data = await this.usersService.authenticate(authenticateUserDto);
      return response.status(HttpStatus.OK).send(data);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Get()
  async getUser(@Res() response): Promise<User> {
    try {
      return response.status(HttpStatus.OK).send(response.locals.user);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  // Validate session
  @Get('session/:id')
  async validateSession(
    @Param('id') id: string,
    @Res() response,
  ): Promise<ValidateSessionResponseDto> {
    const user = await this.usersService.findUserSession(id);
    if (!user) {
      return response.status(HttpStatus.UNAUTHORIZED).send({ valid: false });
    }
    const session = user.sessions.find((s) => s.id === id);
    const expired =
      new Date(session.createdAt).getTime() + 3600000 < Date.now();
    return response
      .status(HttpStatus.OK)
      .send({ valid: !expired, name: user.name });
  }

  // Logout
  @Delete('session/:id')
  async logout(
    @Param('id') id: string,
    @Res() response,
  ): Promise<DeleteSessionResponseDto> {
    const deleted = await this.usersService.deleteUserSession(id);
    if (!deleted) {
      return response.status(HttpStatus.BAD_REQUEST).send({ success: false });
    }
    return response.status(HttpStatus.OK).send({ success: true });
  }
}
