import * as os from 'os';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export class Tools {
    public static getSaveFolder(path: string): string {

        let realPath = path;
        if (realPath.trim() === '' || realPath === null || realPath === undefined) {
            const osType = os.type();
            if (osType === 'Windows_NT') {
                realPath = join(os.homedir(), 'Documents');
            } else if (osType === 'Darwin' || osType === 'Linux') {
                realPath = join(os.homedir(), 'Documents');
            }
            realPath = join(realPath, 'postman-utils');
        }

        if (!existsSync(realPath)) {
            mkdirSync(realPath);
        }
        return realPath;
    }
}