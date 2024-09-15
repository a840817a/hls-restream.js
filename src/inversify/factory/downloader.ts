import {inject, injectable} from "inversify";

import {TYPES} from "../../definition/types";
import {IConfig} from "../../definition/interface/config";
import {IFileAccess, ILogger} from "../../definition/interface/io";
import {IDownloadJob, IDownloadManager, IKeyManager} from "../../definition/interface/manager";
import {
    IMapDownloader,
    IMediaDownloader, IMediaListDownloaderItem,
    IMultiVariantListDownloader,
    IPlaylistDownloader,
    IVariantListDownloaderItem
} from "../../definition/interface/downloader";
import {IHlsInfo, IHlsMap, IHlsMediaInfo, IHlsStreamInfo} from "../../definition/interface/hls";

import {
    IDownloadJobFactory,
    IHlsMultiVariantListFactory,
    IHlsPlaylistFactory, IMapDownloaderFactory,
    IMediaDownloaderFactory, IMediaListDownloaderItemFactory,
    IMultiVariantListDownloaderFactory,
    IPlaylistDownloaderFactory,
    IVariantListDownloaderItemFactory
} from "../../definition/interface/factory";
import {MediaDownloader} from "../../services/downloader/mediaDownloader";
import {
    MediaListDownloaderItem,
    MultiVariantListDownloader,
    VariantListDownloaderItem
} from "../../services/downloader/multiVariantListDownloader";
import {PlaylistDownloader} from "../../services/downloader/playlistDownloader";
import {DownloadJob} from "../../services/downloadJob";
import {MapDownloader} from "../../services/downloader/MapDownloader";

@injectable()
export class DownloadJobFactory implements IDownloadJobFactory {
    constructor(@inject(TYPES.Logger) private logger: ILogger,
                @inject(TYPES.DownloadManager) private downloadManager: IDownloadManager,
                @inject(TYPES.MultiVariantListDownloaderFactory) private multiVariantListDownloaderFactory: IMultiVariantListDownloaderFactory,
                @inject(TYPES.PlaylistDownloaderFactory) private playlistDownloaderFactory: IPlaylistDownloaderFactory) {
    }

    create(title: string, sourceUrl: string): IDownloadJob {
        return new DownloadJob(
            this.logger,
            this.downloadManager,
            this.multiVariantListDownloaderFactory,
            this.playlistDownloaderFactory,
            title, sourceUrl);
    }
}

@injectable()
export class MultiVariantListDownloaderFactory implements IMultiVariantListDownloaderFactory {
    constructor(@inject(TYPES.Config) private config: IConfig,
                @inject(TYPES.Logger) private logger: ILogger,
                @inject(TYPES.DownloadManager) private downloadManager: IDownloadManager,
                @inject(TYPES.FileAccess) private fileManager: IFileAccess,
                @inject(TYPES.MediaListDownloaderItemFactory) private mediaListDownloaderItemFactory: IMediaListDownloaderItemFactory,
                @inject(TYPES.VariantListDownloaderItemFactory) private variantListDownloaderItemFactory: IVariantListDownloaderItemFactory,
                @inject(TYPES.HlsMultiVariantListFactory) private hlsMultiVariantListFactory: IHlsMultiVariantListFactory) {
    }

    create(originalUri: string, targetPath: string, source?: string): IMultiVariantListDownloader {
        return new MultiVariantListDownloader(
            this.config,
            this.logger,
            this.downloadManager,
            this.fileManager,
            this.mediaListDownloaderItemFactory,
            this.variantListDownloaderItemFactory,
            this.hlsMultiVariantListFactory,
            originalUri, targetPath, source);
    }
}

@injectable()
export class PlaylistDownloaderFactory implements IPlaylistDownloaderFactory {
    constructor(@inject(TYPES.Config) private config: IConfig,
                @inject(TYPES.Logger) private logger: ILogger,
                @inject(TYPES.DownloadManager) private downloadManager: IDownloadManager,
                @inject(TYPES.FileAccess) private fileManager: IFileAccess,
                @inject(TYPES.MapDownloaderFactory) private mapDownloaderFactory: IMapDownloaderFactory,
                @inject(TYPES.MediaDownloaderFactory) private mediaDownloaderFactory: IMediaDownloaderFactory,
                @inject(TYPES.HlsPlaylistFactory) private hlsPlaylistFactory: IHlsPlaylistFactory) {
    }

    create(originalUri: string, targetPath: string, source?: string): IPlaylistDownloader {
        return new PlaylistDownloader(
            this.config,
            this.logger,
            this.downloadManager,
            this.fileManager,
            this.mapDownloaderFactory,
            this.mediaDownloaderFactory,
            this.hlsPlaylistFactory,
            originalUri, targetPath, source);
    }
}

@injectable()
export class MediaListDownloaderItemFactory implements IMediaListDownloaderItemFactory {
    constructor(@inject(TYPES.PlaylistDownloaderFactory) private playlistDownloaderFactory: IPlaylistDownloaderFactory) {
    }

    create(info: IHlsMediaInfo, id: string, name: string, targetPath: string): IMediaListDownloaderItem {
        return new MediaListDownloaderItem(
            this.playlistDownloaderFactory,
            info, id, name, targetPath);
    }
}

@injectable()
export class VariantListDownloaderItemFactory implements IVariantListDownloaderItemFactory {
    constructor(@inject(TYPES.PlaylistDownloaderFactory) private playlistDownloaderFactory: IPlaylistDownloaderFactory) {
    }

    create(info: IHlsStreamInfo, id: string, name: string, targetPath: string): IVariantListDownloaderItem {
        return new VariantListDownloaderItem(
            this.playlistDownloaderFactory,
            info, id, name, targetPath);
    }
}

@injectable()
export class MapDownloaderFactory implements IMapDownloaderFactory {
    constructor(@inject(TYPES.Config) private config: IConfig,
                @inject(TYPES.Logger) private logger: ILogger,
                @inject(TYPES.DownloadManager) private downloadManager: IDownloadManager,
                @inject(TYPES.FileAccess) private fileManager: IFileAccess) {
    }

    create(info: IHlsMap, targetPath: string, id: string): IMapDownloader {
        return new MapDownloader(
            this.config,
            this.logger,
            this.downloadManager,
            this.fileManager,
            info, targetPath, id);
    }
}

@injectable()
export class MediaDownloaderFactory implements IMediaDownloaderFactory {
    constructor(@inject(TYPES.Config) private config: IConfig,
                @inject(TYPES.Logger) private logger: ILogger,
                @inject(TYPES.DownloadManager) private downloadManager: IDownloadManager,
                @inject(TYPES.FileAccess) private fileManager: IFileAccess,
                @inject(TYPES.KeyManager) private keyManager: IKeyManager) {
    }

    create(info: IHlsInfo, targetPath: string, sequence: number): IMediaDownloader {
        return new MediaDownloader(
            this.config,
            this.logger,
            this.downloadManager,
            this.fileManager,
            this.keyManager,
            info, targetPath, sequence);
    }
}
