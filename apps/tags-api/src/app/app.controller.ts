import { Body, Controller, Post } from '@nestjs/common';
import { GetTagsDto } from './dtos/get-tags.dto';

const TASK_KEYWORDS = ['something', 'do', 'todo'];

@Controller()
export class AppController {
  @Post()
  getTags(@Body() { title }: GetTagsDto): string[] {
    const parts = title.toLowerCase().split(' ');
    return parts.some(p => TASK_KEYWORDS.includes(p)) ? ['task'] : [];
  }
}
