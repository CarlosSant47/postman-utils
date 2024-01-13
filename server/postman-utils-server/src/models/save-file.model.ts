import { IsNotEmpty } from 'class-validator';


export class SaveFileModel {
    fileName: string;
    @IsNotEmpty()
    content: string;
    @IsNotEmpty()
    decodedMethod: 'base64' | 'utf8'
}