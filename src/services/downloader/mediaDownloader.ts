import {IConfig} from "../../definition/interface/config";
import {IFileAccess, ILogger} from "../../definition/interface/io";
import {IDownloadManager, IKeyManager} from "../../definition/interface/manager";
import {IMediaDownloader} from "../../definition/interface/downloader";
import {IHlsInfo} from "../../definition/interface/hls";

import {DownloadStatus} from "../../definition/enum";
import {UrlUtilities} from "../../utilities/url";
import {EncryptionUtilities} from "../../utilities/encryption";


export class MediaDownloader implements IMediaDownloader {
    info: IHlsInfo;
    status: DownloadStatus;
    sequence: number;
    targetPath: string;
    fileExtension: string;
    private errorCount: number = 0

    get filename() {
        return `media_${this.sequence}.${this.fileExtension}`;
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
        private keyManager: IKeyManager,
        info: IHlsInfo, targetPath: string, sequence: number
    ) {
        this.info = info;
        this.sequence = sequence
        this.targetPath = targetPath
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
            data = await this.downloadManager.getBinary(this.info.uri, 20 + this.errorCount);
        }
        catch (error) {
            this.logger.logError('Cannot get media, Error:\n', JSON.stringify(error));
            this.downloadErrorRetry();
            return;
        }

        if (data == undefined) {
            this.logger.logError('Cannot get media, response empty');
            this.downloadErrorRetry();
            return;
        }

        if (this.info.key != undefined && this.info.key.method != '') {
            switch (this.info.key.method) {
                case 'AES-128':
                    let keyUri = this.info.key.uri;
                    if (!keyUri.match(/^(?:[a-z+]+:)?\/\//)) {
                        keyUri = UrlUtilities.getUrlBase(this.info.uri) + keyUri;
                    }
                    let key = await this.keyManager.getKey(keyUri);
                    if (key == undefined) {
                        this.downloadErrorRetry();
                        return;
                    }

                    data = EncryptionUtilities.DecryptAes128Data(data, key, this.info.key.iv);
                    if (data == undefined) {
                        this.downloadErrorRetry();
                        return;
                    }
                    break;
                default:
                    this.logger.logError('Unknown Encrypt method');
                    this.status = DownloadStatus.failed;
            }
        }

        this.fileManager.saveFile(this.fullPath, data);
        this.status = DownloadStatus.success;
    }

    downloadErrorRetry() {
        this.errorCount++;
        if (this.errorCount > this.config.MAX_ERROR_RETRY) {
            this.status = DownloadStatus.failed;
            return
        }

        setTimeout(this.getSource.bind(this), (this.info.duration / 2) * 1000);
    }
}
