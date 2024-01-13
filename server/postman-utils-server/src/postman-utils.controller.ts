import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { PostmanUtilsService } from './postman-utils.service';
import { FileContent } from './models/file-content';
import { ResponseModel } from './models/response-model';
import { SaveFileModel } from './models/save-file.model';

@Controller('files')
export class PostmanUtilsController {
    constructor(private readonly appService: PostmanUtilsService) { }

    @Get()
    getHello(@Query('path') path: string): FileContent {
        return this.appService.getFileContent(path);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    saveFile(@Body() fileContent: SaveFileModel): ResponseModel {
        return this.appService.saveFile(fileContent);
    }
}
