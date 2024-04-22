import {IConfig} from "../../definition/interface/config";
import {IFileAccess} from "../../definition/interface/io";
import {IDownloadManager} from "../../definition/interface/manager";
import {
    IMultiVariantListDownloader,
    IPlaylistDownloader,
    IVariantListDownloaderItem
} from "../../definition/interface/downloader";
import {
    IHlsMultiVariantListFactory,
    IPlaylistDownloaderFactory,
    IVariantListDownloaderItemFactory
} from "../../definition/interface/factory";
import {IHlsMultiVariantList, IHlsStreamInfo} from "../../definition/interface/hls";

import {PlaylistType} from "../../definition/enum";
import {UrlUtilities} from "../../utilities/url";

export class MultiVariantListDownloader implements IMultiVariantListDownloader {
    type = PlaylistType.multiVariantPlaylist;

    source?: IHlsMultiVariantList;
    targetPath: string;
    originalUri: string;
    data: IVariantListDownloaderItem[] = [];

    public constructor(
        private config: IConfig,
        private httpDownloader: IDownloadManager,
        private fileManager: IFileAccess,
        private variantListDownloaderItemFactory: IVariantListDownloaderItemFactory,
        private hlsMultiVariantListFactory: IHlsMultiVariantListFactory,
        originalUri: string, targetPath: string, source?: string
    ) {
        this.originalUri = originalUri;
        this.targetPath = targetPath;

        if (source != undefined) {
            let data = this.hlsMultiVariantListFactory.create();
            data.parse(source, UrlUtilities.getUrlBase(this.originalUri));
            this.init(data);
        } else {
            this.getSource().then(data => this.init(data));
        }
    }

    get fullPath() {
        return `${this.config.OUTPUT_PATH}${this.targetPath}`;
    }

    private init(data: IHlsMultiVariantList) {
        this.source = data;
        this.source.data.forEach((value) => {
            const name = UrlUtilities.getUrlFilename(value.uri ?? 'default')!;
            this.data.push(this.variantListDownloaderItemFactory.create(value, name, `${this.targetPath}/${name}`));
        });
        this.saveFile();
    }

    async getSource() {
        let data = await this.httpDownloader.get(this.originalUri, 30);
        let hls = this.hlsMultiVariantListFactory.create();
        hls.parse(data, UrlUtilities.getUrlBase(this.originalUri));
        return hls;
    }

    generateIndex(windowSize?: number) {
        if (this.source == undefined) return '';

        let startIndex = 0;
        if (windowSize != undefined && this.data.length > windowSize) {
            startIndex = this.data.length - windowSize;
        }

        let result = '#EXTM3U\n#EXT-X-VERSION:3\n'
        if (this.source.independentSegments) result += '#EXT-X-INDEPENDENT-SEGMENTS\n';

        for (let i = startIndex; i < this.data.length; i++) {
            result += `#EXT-X-STREAM-INF:BANDWIDTH=${this.data[i].info.bandwidth},` +
                `AVERAGE-BANDWIDTH=${this.data[i].info.averageBandwidth},` +
                `CODECS="${this.data[i].info.codecs}",` +
                `RESOLUTION=${this.data[i].info.resolution},` +
                `FRAME-RATE=${this.data[i].info.frameRate.toFixed(3)}\n` +
                `${this.data[i].name}/index.m3u8\n`
        }

        return result;
    }

    async saveFile() {
        this.fileManager.saveFile(`${this.fullPath}/index.m3u8`, this.generateIndex());
    }
}

export class VariantListDownloaderItem implements IVariantListDownloaderItem {
    name: string;
    info: IHlsStreamInfo;
    playList: IPlaylistDownloader;

    constructor(playlistDownloaderFactory: IPlaylistDownloaderFactory,
                info: IHlsStreamInfo, name: string, targetPath: string) {
        if (info.uri == undefined) throw Error("No Download Url!");
        this.info = info;
        this.name = name;
        this.playList = playlistDownloaderFactory.create(info.uri, targetPath);
    }
}