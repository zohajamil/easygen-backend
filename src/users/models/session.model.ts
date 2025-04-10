import { IsDate, IsString } from 'class-validator';

export class Session {
  @IsString()
  id: string;

  @IsDate()
  createdAt: Date;
}
