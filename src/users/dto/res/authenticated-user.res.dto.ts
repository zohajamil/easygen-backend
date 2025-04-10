import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticatedUserResponseDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
