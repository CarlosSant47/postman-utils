import { Module } from '@nestjs/common';
import { PostmanUtilsController } from './postman-utils.controller';
import { PostmanUtilsService } from './postman-utils.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';


@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
        }),
    ],
    controllers: [PostmanUtilsController],
    providers: [PostmanUtilsService],
})
export class AppModule { }
