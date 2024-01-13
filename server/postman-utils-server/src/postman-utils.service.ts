import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FileContent } from './models/file-content';
import { readFileSync, existsSync } from "fs";
import { basename } from "path";

@Injectable()
export class PostmanUtilsService {

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

}