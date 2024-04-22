import {inject, injectable} from "inversify";

import {TYPES} from "../definition/types";
import {ILogger} from "../definition/interface/io";
import {IDownloadManager, IKeyManager} from "../definition/interface/manager";

@injectable()
export class KeyManager implements IKeyManager {
    private keys: { [id: string]: Buffer } = {};

    constructor(@inject(TYPES.Logger) private logger: ILogger,
                @inject(TYPES.DownloadManager) private downloadManager: IDownloadManager) {
        this.logger.setClassName((this as any).constructor.name);
    }

    async getKey(uri: string) {
        if (uri in this.keys) return this.keys[uri];
        let download = await this.downloadManager.getBinary(uri, 50);
        if (download == undefined) {
            this.logger.logError('Cannot get key !:');
            return undefined;
        }
        this.keys[uri] = download;
        return download;
    }
}