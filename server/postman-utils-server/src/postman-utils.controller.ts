import { Controller, Get, Query } from '@nestjs/common';
import * as fs from 'fs';
import { PostmanUtilsService } from './postman-utils.service';
import { FileContent } from './models/file-content';

@Controller('files')
export class PostmanUtilsController {
    constructor(private readonly appService: PostmanUtilsService) { }

    @Get()
    getHello(@Query('path') path: string): FileContent {
        return this.appService.getFileContent(path);
    }
}
