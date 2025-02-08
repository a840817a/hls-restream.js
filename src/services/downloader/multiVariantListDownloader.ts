import {IConfig} from "../../definition/interface/config";
import {IFileAccess, ILogger} from "../../definition/interface/io";
import {IDownloadManager} from "../../definition/interface/manager";
import {
    IMediaListDownloaderItem,
    IMultiVariantListDownloader,
    IPlaylistDownloader,
    IVariantListDownloaderItem
} from "../../definition/interface/downloader";
import {
    IHlsMultiVariantListFactory, IMediaListDownloaderItemFactory,
    IPlaylistDownloaderFactory,
    IVariantListDownloaderItemFactory
} from "../../definition/interface/factory";
import {IHlsMediaInfo, IHlsMultiVariantList, IHlsStreamInfo} from "../../definition/interface/hls";

import {PlaylistType} from "../../definition/enum";
import {UrlUtilities} from "../../utilities/url";

export class MultiVariantListDownloader implements IMultiVariantListDownloader {
    type = PlaylistType.multiVariantPlaylist;

    source?: IHlsMultiVariantList;
    targetPath: string;
    originalUri: string;
    headers: string | undefined;
    media: IMediaListDownloaderItem[] = [];
    data: IVariantListDownloaderItem[] = [];

    public constructor(
        private config: IConfig,
        private logger: ILogger,
        private downloadManager: IDownloadManager,
        private fileManager: IFileAccess,
        private mediaListDownloaderItemFactory: IMediaListDownloaderItemFactory,
        private variantListDownloaderItemFactory: IVariantListDownloaderItemFactory,
        private hlsMultiVariantListFactory: IHlsMultiVariantListFactory,
        originalUri: string, targetPath: string, headers?: string, source?: string
    ) {
        this.originalUri = originalUri;
        this.targetPath = targetPath;
        this.headers = headers;

        this.logger.setClassName((this as any).constructor.name);

        if (source != undefined) {
            let data = this.hlsMultiVariantListFactory.create();
            data.parse(source, UrlUtilities.getUrlBase(this.originalUri));
            this.init(data);
        } else {
            this.getSource().then(data => {
                this.init(data)
            }).catch((error) => {
                this.logger.logError(`Cannot get source: ${this.originalUri}\n`, error);
            });
        }
    }

    get fullPath() {
        return `${this.config.OUTPUT_PATH}${this.targetPath}`;
    }

    private init(data: IHlsMultiVariantList) {
        this.source = data;
        for (let i = 0; i < this.source.media.length; i++)
        {
            const name = UrlUtilities.getUrlFilename(this.source.media[i].uri ?? 'default')!;
            const id = `media_${i + 1}`;
            this.media.push(this.mediaListDownloaderItemFactory.create(this.source.media[i], id, name, `${this.targetPath}/${id}`, this.headers));
        }
        for (let i = 0; i < this.source.data.length; i++)
        {
            const name = UrlUtilities.getUrlFilename(this.source.data[i].uri ?? 'default')!;
            const id = `stream_${i + 1}`;
            this.data.push(this.variantListDownloaderItemFactory.create(this.source.data[i], id, name, `${this.targetPath}/${id}`, this.headers));
        }
        this.saveFile();
    }

    async getSource() {
        let data: any;
        try {
            data = await this.downloadManager.get(this.originalUri, 30, this.headers);
        }
        catch (e) {
            throw e;
        }

        let hls = this.hlsMultiVariantListFactory.create();
        hls.parse(data, UrlUtilities.getUrlBase(this.originalUri));
        return hls;
    }

    generateIndex() {
        if (this.source == undefined) return '';

        let result = '#EXTM3U\n#EXT-X-VERSION:3\n'
        if (this.source.independentSegments) result += '#EXT-X-INDEPENDENT-SEGMENTS\n';

        result += '\n';

        for (let i = 0; i < this.media.length; i++) {
            result += `#EXT-X-MEDIA:TYPE=${this.media[i].info.type},` +
            `GROUP-ID="${this.media[i].info.groupId}",` +
            `NAME="${this.media[i].info.name}"`;

            if (this.media[i].info.language != undefined) result += `,LANGUAGE="${this.media[i].info.language}"`;
            if (this.media[i].info.assocLanguage != undefined) result += `,ASSOC-LANGUAGE="${this.media[i].info.language}"`;
            if (this.media[i].info.default != undefined) result += `,DEFAULT="${this.media[i].info.default ? "YES" : "NO"}"`;
            if (this.media[i].info.autoSelect != undefined) result += `,AUTOSELECT="${this.media[i].info.autoSelect ? "YES" : "NO"}"`;
            if (this.media[i].info.forced != undefined) result += `,FORCED="${this.media[i].info.forced ? "YES" : "NO"}"`;
            if (this.media[i].info.inStreamId != undefined) result += `,INSTREAM-ID="${this.media[i].info.inStreamId}"`;
            if (this.media[i].info.characteristics != undefined) result += `,CHARACTERISTICS="${this.media[i].info.characteristics}"`;
            if (this.media[i].info.channels != undefined) result += `,CHANNELS="${this.media[i].info.channels}"`;
            if (this.media[i].info.uri != undefined) result += `,URI="${this.media[i].id}/index.m3u8"`;
            result += '\n';
        }

        if (this.media.length > 0) result += '\n';

        for (let i = 0; i < this.data.length; i++) {
            result += `#EXT-X-STREAM-INF:BANDWIDTH=${this.data[i].info.bandwidth},` +
                `AVERAGE-BANDWIDTH=${this.data[i].info.averageBandwidth},` +
                `CODECS="${this.data[i].info.codecs}",` +
                `RESOLUTION=${this.data[i].info.resolution},` +
                `FRAME-RATE=${this.data[i].info.frameRate.toFixed(3)}`;

            if (this.data[i].info.subtitles != undefined) result += `,SUBTITLES="${this.data[i].info.subtitles}"`;
            if (this.data[i].info.audio != undefined) result += `,AUDIO="${this.data[i].info.audio}"`;

            result += `\n${this.data[i].id}/index.m3u8\n`;
        }

        return result;
    }

    async saveFile() {
        this.fileManager.saveFile(`${this.fullPath}/index.m3u8`, this.generateIndex());
    }
}

export class MediaListDownloaderItem implements IMediaListDownloaderItem {
    id: string;
    name: string;
    info: IHlsMediaInfo;
    playList: IPlaylistDownloader;
    headers: string | undefined;

    constructor(playlistDownloaderFactory: IPlaylistDownloaderFactory,
                info: IHlsMediaInfo, id: string, name: string, targetPath: string, headers?: string) {
        if (info.uri == undefined) throw Error("No Download Url!");
        this.id = id
        this.info = info;
        this.name = name;
        this.playList = playlistDownloaderFactory.create(info.uri, targetPath, headers);
    }
}

export class VariantListDownloaderItem implements IVariantListDownloaderItem {
    id: string;
    name: string;
    info: IHlsStreamInfo;
    playList: IPlaylistDownloader;
    headers: string | undefined;

    constructor(playlistDownloaderFactory: IPlaylistDownloaderFactory,
                info: IHlsStreamInfo, id: string, name: string, targetPath: string, headers?: string) {
        if (info.uri == undefined) throw Error("No Download Url!");
        this.id = id
        this.info = info;
        this.name = name;
        this.playList = playlistDownloaderFactory.create(info.uri, targetPath, headers);
    }
}
