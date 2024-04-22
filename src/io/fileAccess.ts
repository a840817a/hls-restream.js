import fs from "fs";

import {injectable} from "inversify";

import {IFileAccess} from "../definition/interface/io";

@injectable()
export class FileAccess implements IFileAccess {
    checkPathExists(path: string): boolean {
        return fs.existsSync(path);
    }

    createDirectoryRecursive(path: string): string | undefined {
        return fs.mkdirSync(path, {recursive: true});
    }

    saveFile(path: string, data: string | NodeJS.ArrayBufferView): void {
        fs.writeFileSync(path, data);
    }
}