import crypto from "crypto";
import {inject, injectable} from "inversify";

import {TYPES} from "../definition/types";
import {ILogger} from "../definition/interface/io";
import {IDownloadJob, IDownloadManager} from "../definition/interface/manager";
import {IHlsDownloader} from "../definition/interface/downloader";
import {IMultiVariantListDownloaderFactory, IPlaylistDownloaderFactory} from "../definition/interface/factory";

@injectable()
export class DownloadJob implements IDownloadJob {
    id: string;
    title: string | undefined;
    sourceUrl: string;
    downloader?: IHlsDownloader;

    get playerLink(): string {
        return `/player/${this.id}`
    }

    constructor(@inject(TYPES.Logger) private logger: ILogger,
                @inject(TYPES.DownloadManager) private downloadManager: IDownloadManager,
                @inject(TYPES.MultiVariantListDownloaderFactory) private multiVariantListDownloaderFactory: IMultiVariantListDownloaderFactory,
                @inject(TYPES.PlaylistDownloaderFactory) private playlistDownloaderFactory: IPlaylistDownloaderFactory,
                title: string | undefined, sourceUrl: string) {
        this.logger.setClassName((this as any).constructor.name);

        this.id = crypto.randomUUID();
        this.title = title;
        this.sourceUrl = sourceUrl;

        this.downloadHls();
    }

    async downloadHls() {
        try {
            const result = await this.downloadManager.get(this.sourceUrl, 30);

            if (result.includes('#EXT-X-STREAM-INF')) {
                this.downloader =  this.multiVariantListDownloaderFactory.create(this.sourceUrl, this.id, result);
            }
            else {
                this.downloader = this.playlistDownloaderFactory.create(this.sourceUrl, this.id, result);
            }
        } catch (error) {
            this.logger.logError(`Error downloading file: ${this.sourceUrl}\n`, error);
            this.downloader =  undefined;
        }
    }
}
