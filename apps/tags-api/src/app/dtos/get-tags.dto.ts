import { IsString, MinLength } from 'class-validator';

export class GetTagsDto {
  @IsString()
  @MinLength(1)
  title: string;
}
