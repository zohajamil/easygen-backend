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
import { ValidateSessionResponseDto } from './dto/res/validate-session.res.dto';
import { DeleteSessionResponseDto } from './dto/res/delete-session.res.dto';
import { DeleteUserRequestDto } from './dto/req/delete-user.req.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Sign up
  @Post()
  async signUp(
    @Res() response,
    @Body() createUserDto: CreateUserRequestDto,
  ): Promise<AuthenticatedUserResponseDto> {
    try {
      const data = await this.usersService.signUp(createUserDto);
      return response.status(HttpStatus.OK).send(data);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  // Login
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

  // Delete user (added this for testing only)
  @Delete()
  async deleteUser(
    @Res() response,
    @Body() deleteUserDto: DeleteUserRequestDto,
  ): Promise<AuthenticatedUserResponseDto> {
    try {
      const data = await this.usersService.deleteUser(deleteUserDto.email);
      return response.status(HttpStatus.OK).send(data);
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
