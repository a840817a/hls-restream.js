import {IConfig} from "../../definition/interface/config";
import {IFileAccess, ILogger} from "../../definition/interface/io";
import {IDownloadManager} from "../../definition/interface/manager";
import {IMapDownloader} from "../../definition/interface/downloader";
import {IHlsMap} from "../../definition/interface/hls";

import {DownloadStatus} from "../../definition/enum";
import {UrlUtilities} from "../../utilities/url";


export class MapDownloader implements IMapDownloader {
    info: IHlsMap;
    headers: string | undefined;
    status: DownloadStatus;
    id: string;
    targetPath: string;
    fileExtension: string;
    private errorCount: number = 0

    get filename() {
        return `map_${this.id}.${this.fileExtension}`;
    }

    get fullPath() {
        return `${this.config.OUTPUT_PATH}${this.targetPath}/${this.filename}`;
    }

    get ready() {
        return this.status == DownloadStatus.success;
    }

    get downloading() {
        return this.status == DownloadStatus.downloading;
    }

    constructor(
        private config: IConfig,
        private logger: ILogger,
        private downloadManager: IDownloadManager,
        private fileManager: IFileAccess,
        info: IHlsMap, targetPath: string, id: string, headers?: string
    ) {
        this.info = info;
        this.id = id
        this.targetPath = targetPath
        this.headers = headers
        this.status = DownloadStatus.downloading;

        this.logger.setClassName((this as any).constructor.name);

        let fileExtension = UrlUtilities.getUrlExtension(this.info.uri);
        if (fileExtension == undefined) {
            throw Error('Cannot get file extension');
        }

        this.fileExtension = fileExtension;
        this.getSource();
    }

    async getSource() {
        let data: Buffer | undefined;
        try {
            data = await this.downloadManager.getBinary(this.info.uri, 25 + this.errorCount, this.headers);
        }
        catch (error) {
            this.logger.logError('Cannot get map from uri: ' + this.info.uri, error);
            this.downloadErrorRetry();
            return;
        }

        if (data == undefined) {
            this.logger.logError('Cannot get map, response empty');
            this.downloadErrorRetry();
            return;
        }

        this.fileManager.saveFile(this.fullPath, data);
        this.status = DownloadStatus.success;
    }

    downloadErrorRetry() {
        this.errorCount++;
        if (this.config.MAX_ERROR_RETRY >= 0 && this.errorCount > this.config.MAX_ERROR_RETRY) {
            this.status = DownloadStatus.failed;
            return
        }

        setTimeout(this.getSource.bind(this), 2000);
    }
}
