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

    async getKey(uri: string, headers?: string) {
        const keyObj = {
            uri: uri,
            headers: headers
        };

        const keyId = JSON.stringify(keyObj);

        if (keyId in this.keys) return this.keys[keyId];
        let download: Buffer | undefined;

        try {
            download = await this.downloadManager.getBinary(uri, 50, headers);
        }
        catch (error) {
            this.logger.logError('Cannot get key from: ' + keyId, error);
            return undefined;
        }

        if (download == undefined) {
            this.logger.logError('Cannot get key: ' + keyId + ' response empty');
            return undefined;
        }

        this.keys[keyId] = download;
        return download;
    }
}
