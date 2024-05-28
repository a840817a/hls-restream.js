import {IConfig} from "../../definition/interface/config";
import {IFileAccess, ILogger} from "../../definition/interface/io";
import {IDownloadManager} from "../../definition/interface/manager";
import {IMediaDownloader, IPlaylistDownloader} from "../../definition/interface/downloader";
import {IHlsPlaylistFactory, IMediaDownloaderFactory} from "../../definition/interface/factory";

import {PlaylistType} from "../../definition/enum";
import {UrlUtilities} from "../../utilities/url";
import {IHlsPlaylist} from "../../definition/interface/hls";

export class PlaylistDownloader implements IPlaylistDownloader {
    type = PlaylistType.playlist;

    source?: IHlsPlaylist;
    originalUri: string;
    targetPath: string;
    currentMediaSequence = 0;
    data: IMediaDownloader[] = [];

    get fullPath() {
        return `${this.config.OUTPUT_PATH}${this.targetPath}`;
    }

    public constructor(private config: IConfig,
                       private logger: ILogger,
                       private downloadManager: IDownloadManager,
                       private fileManager: IFileAccess,
                       private mediaDownloaderFactory: IMediaDownloaderFactory,
                       private hlsPlaylistFactory: IHlsPlaylistFactory,
                       originalUri: string, targetPath: string, source?: string) {
        this.originalUri = originalUri;
        this.targetPath = targetPath;

        this.logger.setClassName((this as any).constructor.name);

        if (!this.fileManager.checkPathExists(this.fullPath)) {
            this.fileManager.createDirectoryRecursive(this.fullPath);
        }

        if (source != undefined) {
            let data = this.hlsPlaylistFactory.create();
            data.parse(source, UrlUtilities.getUrlBase(this.originalUri));
            this.init(data);
        } else {
            this.getSource().then(data => {
                this.init(data);
            });
        }
    }

    private init(data: IHlsPlaylist) {
        this.source = data;
        this.source.data.forEach((value, index) => {
            this.data.push(this.mediaDownloaderFactory.create(value, this.targetPath, index));
        });
        this.currentMediaSequence = data.mediaSequence + data.data.length;
        this.saveFile();
        if (!this.source.completed) setTimeout(this.updateData.bind(this), this.source.targetDuration * 1000);
    }

    async getSource() {
        let data: any;
        try {
            data = await this.downloadManager.get(this.originalUri, 30);
        }
        catch (e) {
            throw e;
        }

        let hls = this.hlsPlaylistFactory.create();
        hls.parse(data, UrlUtilities.getUrlBase(this.originalUri));
        return hls;
    }

    private async updateData() {
        if (this.source == undefined) return;

        try {
            let newSource = await this.getSource();
            let newMediaSequence = newSource.mediaSequence + newSource.data.length;
            let newCount = newMediaSequence - this.currentMediaSequence;
            if (newCount <= 0) {
                // no new data
                setTimeout(this.updateData.bind(this), (this.source?.targetDuration / 2) * 1000);
            } else {
                let startIndex = newSource.data.length - newCount;
                if (startIndex < 0) {
                    this.logger.logError(`Missing frame detected, count ${startIndex * -1}`);
                    startIndex = 0;
                }

                for (let i = startIndex; i < newSource.data.length; i++) {
                    this.data.push(this.mediaDownloaderFactory.create(newSource.data[i], this.targetPath, this.data.length));
                }

                this.source = newSource;
                this.currentMediaSequence = newMediaSequence;
                await this.saveFile();
                if (!this.source.completed) setTimeout(this.updateData.bind(this), this.source?.targetDuration * 1000);
            }
        } catch (e) {
            this.logger.logError('Unknown error update playlist\n', JSON.stringify(e));
            setTimeout(this.updateData.bind(this), (this.source?.targetDuration / 2) * 1000);
        }
    }

    generateIndex(pathPrefix?: string, windowSize?: number) {
        if (this.source == undefined) return '';

        let startIndex = 0;
        if (windowSize != undefined && this.data.length > windowSize) {
            startIndex = this.data.length - windowSize;
        }

        let result = '#EXTM3U\n#EXT-X-VERSION:3\n' +
            `#EXT-X-TARGETDURATION:${this.source.targetDuration}\n` +
            `#EXT-X-MEDIA-SEQUENCE:${startIndex}\n`

        for (let i = startIndex; i < this.data.length; i++) {
            if (this.data[i].downloading) return result;
            result += `#EXTINF:${this.data[i].info.duration.toFixed(5)},\n`;

            if (pathPrefix != undefined) {
                if (pathPrefix.slice(-1) !== '/') pathPrefix += '/';
                result += `${pathPrefix}${this.data[i].filename}\n`
            }
            else {
                result += `${this.data[i].filename}\n`
            }
        }

        if (this.source.completed) result += '#EXT-X-ENDLIST\n';

        return result;
    }

    async saveFile() {
        this.fileManager.saveFile(`${this.fullPath}/index.m3u8`, this.generateIndex());
    }
}