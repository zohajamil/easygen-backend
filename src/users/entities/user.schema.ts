import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { Session } from '../models/session.model';

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  @IsEmail()
  email: string;

  @Prop()
  password: string;

  @Prop([{ type: Session }])
  sessions: Session[];
}
export const UserSchema = SchemaFactory.createForClass(User);
