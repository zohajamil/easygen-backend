import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserRequestDto } from './dto/req/create-user.req.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async signUp(
    createUserDto: CreateUserRequestDto,
    sessionId: string,
  ): Promise<User> {
    try {
      Logger.log('Creating new user');
      const createdUser = await this.userModel.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
        sessions: [{ id: sessionId, createdAt: new Date() }],
      });
      return createdUser.toObject();
    } catch (error) {
      Logger.error('user.repository', 'signUp', error.message, error.stack, '');
      throw new InternalServerErrorException(error.message);
    }
  }

  async signIn(userId: string, sessionId: string): Promise<boolean> {
    try {
      Logger.log('Sigining in user');
      const updated = await this.userModel.updateOne(
        { _id: userId },
        { $push: { sessions: { id: sessionId, createdAt: new Date() } } },
      );
      return updated.modifiedCount > 0 ? true : false;
    } catch (error) {
      Logger.error('user.repository', 'signUp', error.message, error.stack, '');
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUser(email: string): Promise<User> {
    try {
      Logger.log('Getting user');

      const user: User = await this.userModel
        .findOne({ email: email }, { __v: 0 })
        .lean();
      return user;
    } catch (error) {
      Logger.error(
        'user.repository',
        'getUser',
        error.message,
        error.stack,
        '',
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async findUserSession(sessionId: string): Promise<User> {
    try {
      Logger.log('Getting user session');
      const user: User = await this.userModel
        .findOne({ 'sessions.id': sessionId }, { __v: 0 })
        .lean();
      return user;
    } catch (error) {
      Logger.error(
        'user.repository',
        'findUserSession',
        error.message,
        error.stack,
        '',
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUserSession(sessionId: string): Promise<boolean> {
    try {
      Logger.log('Deleting user session');

      const result = await this.userModel.updateOne(
        { 'sessions.id': sessionId },
        { $pull: { sessions: { id: sessionId } } },
      );
      Logger.log(`Modified count: ${result.modifiedCount}`);

      return result.modifiedCount > 0 ? true : false;
    } catch (error) {
      Logger.error(
        'user.repository',
        'deleteUserSession',
        error.message,
        error.stack,
        '',
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUser(email: string): Promise<boolean> {
    try {
      Logger.log('Deleting user');

      const result = await this.userModel.deleteOne({ email: email });
      Logger.log(`Modified count: ${result.deletedCount}`);

      return result.deletedCount > 0 ? true : false;
    } catch (error) {
      Logger.error(
        'user.repository',
        'deleteUser',
        error.message,
        error.stack,
        '',
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
