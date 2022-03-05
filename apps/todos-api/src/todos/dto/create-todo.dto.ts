import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
