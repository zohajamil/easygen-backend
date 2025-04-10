import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthenticatedUserResponseDto } from './dto/res/authenticated-user.res.dto';
import { CreateUserRequestDto } from './dto/req/create-user.req.dto';
import { UsersRepository } from './users.repository';
import { AuthenticateUserRequestDto } from './dto/req/authenticate-user.req.dto';
import { AuthService } from 'src/auth/auth.service';
import { hashPassword, validatePassword } from 'src/utils/password.utils';
import * as mongoose from 'mongoose';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly loggingService: LoggingService,
  ) {}

  async signUp(
    createUserDto: CreateUserRequestDto,
  ): Promise<AuthenticatedUserResponseDto> {
    try {
      const existingUser = await this.userRepository.getUser(
        createUserDto.email,
      );
      if (existingUser && existingUser.email) {
        throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
      } else {
        const passwordHash = await hashPassword(createUserDto.password);
        const sessionId = new mongoose.Types.ObjectId().toString();
        const user = await this.userRepository.signUp(
          {
            ...createUserDto,
            password: passwordHash,
          },
          sessionId,
        );

        // Generate encrypted "token"
        const token = this.authService.generateToken(user._id.toString());
        return { token, sessionId };
      }
    } catch (error) {
      this.loggingService.create({
        description: `Error while signing up ${createUserDto.email} - ${error.message}.`,
        isError: true,
      });
      throw new InternalServerErrorException(error.message);
    }
  }

  async authenticate(
    authenticateUserDto: AuthenticateUserRequestDto,
  ): Promise<AuthenticatedUserResponseDto> {
    try {
      const user = await this.userRepository.getUser(authenticateUserDto.email);
      const passwordValidated = await validatePassword(
        authenticateUserDto.password,
        user.password,
      );

      if (!user || !passwordValidated) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const sessionId = new mongoose.Types.ObjectId().toString();
      const signedIn = await this.userRepository.signIn(user._id, sessionId);

      if (!signedIn) {
        this.loggingService.create({
          description: `Error while logging in ${authenticateUserDto.email}`,
          isError: true,
        });
        throw new InternalServerErrorException('Error while logging in');
      }

      // Generate encrypted "token"
      const token = this.authService.generateToken(user._id.toString());
      return { token, sessionId };
    } catch (error) {
      this.loggingService.create({
        description: `Error while logging in ${authenticateUserDto.email} - ${error.message}.`,
        isError: true,
      });
      throw new InternalServerErrorException(error.message);
    }
  }

  async findUserSession(sessionId: string) {
    try {
      const user = await this.userRepository.findUserSession(sessionId);
      if (!user) {
        throw new HttpException(
          'User session expired',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return user;
    } catch (error) {
      this.loggingService.create({
        description: `Error while finding user session - ${error.message}.`,
        isError: true,
      });
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUserSession(sessionId: string) {
    try {
      const deleted = await this.userRepository.deleteUserSession(sessionId);
      if (!deleted) {
        throw new HttpException(
          'User session expired',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return deleted;
    } catch (error) {
      this.loggingService.create({
        description: `Error while deleting user session - ${error.message}.`,
        isError: true,
      });
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUser(email: string) {
    try {
      await this.userRepository.deleteUser(email);
      return true;
    } catch (error) {
      this.loggingService.create({
        description: `Error while deleting user - ${error.message}.`,
        isError: true,
      });
      throw new InternalServerErrorException(error.message);
    }
  }
}
