import { IsBoolean } from 'class-validator';

export class DeleteSessionResponseDto {
  @IsBoolean()
  success: boolean;
}
