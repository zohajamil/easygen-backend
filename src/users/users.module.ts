import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.schema';
import { LoggingModule } from 'src/logging/logging.module';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    LoggingModule,
    HttpModule,
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
