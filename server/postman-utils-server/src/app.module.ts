import { Module } from '@nestjs/common';
import { PostmanUtilsController } from './postman-utils.controller';
import { PostmanUtilsService } from './postman-utils.service';

@Module({
    imports: [],
    controllers: [PostmanUtilsController],
    providers: [PostmanUtilsService],
})
export class AppModule { }
