import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ValidateSessionResponseDto {
  @IsBoolean()
  valid: boolean;

  @IsString()
  @IsOptional()
  name: string;
}
