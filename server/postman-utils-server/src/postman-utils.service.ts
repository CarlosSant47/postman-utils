import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FileContent } from './models/file-content';
import { readFileSync, existsSync, writeFileSync } from "fs";
import { basename } from "path";
import { createHash } from 'crypto';
import { Tools } from './utils/tools';
import { ResponseModel } from './models/response-model';
import { ConfigService } from '@nestjs/config';
import { SaveFileModel } from './models/save-file.model';

@Injectable()
export class PostmanUtilsService {


    constructor
        (private readonly configService: ConfigService
        ) { }


    private readonly logger = new Logger(PostmanUtilsService.name);

    getFileContent(path: string): FileContent {
        this.logger.log(`getFileContent -> (${path})`);

        if (!path) {
            throw new HttpException('Path is requiered', HttpStatus.CONFLICT);
        }

        if (!existsSync(path)) {
            throw new HttpException('File not exists', HttpStatus.NOT_FOUND);
        }
        const fileContent = {} as FileContent;
        const pathFile = path.replace(/\\/g, "/");
        const data = readFileSync(pathFile, "base64");
        fileContent.content = data;
        fileContent.fileName = basename(pathFile);
        return fileContent;
    }

    saveFile(fileContent: SaveFileModel): ResponseModel {
        this.logger.log(`saveFile()`);
        if (!fileContent.content || fileContent.content.trim() === '') {
            throw new HttpException('Content is requiered', HttpStatus.CONFLICT);
        }
        try {
            let { fileName } = fileContent;
            const currentDate = new Date().toISOString();
            if (!fileName) {
                fileName = createHash('md5').update(currentDate).digest('hex');
            }
            const pathSave = Tools.getSaveFolder(this.configService.get('postman-utils-server.save-file-folder'));

            writeFileSync(`${pathSave}/${fileName}`, fileContent.content, 'base64');
            return {
                message: 'File saved',
                code: HttpStatus.OK,
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.CONFLICT);
        }
    }
}