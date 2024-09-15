import {
    IMapDownloader,
    IMediaDownloader, IMediaListDownloaderItem,
    IMultiVariantListDownloader,
    IPlaylistDownloader,
    IVariantListDownloaderItem
} from "./downloader";
import {IDownloadJob} from "./manager";
import {IHlsInfo, IHlsKey, IHlsMap, IHlsMediaInfo, IHlsMultiVariantList, IHlsPlaylist, IHlsStreamInfo} from "./hls";

export interface IDownloadJobFactory {
    create(title: string | undefined, sourceUrl: string): IDownloadJob;
}


export interface IMultiVariantListDownloaderFactory {
    create(originalUri: string, targetPath: string, source?: string): IMultiVariantListDownloader;
}

export interface IPlaylistDownloaderFactory {
    create(originalUri: string, targetPath: string, source?: string): IPlaylistDownloader;
}

export interface IMediaListDownloaderItemFactory {
    create(info: IHlsMediaInfo, id: string, name: string, targetPath: string): IMediaListDownloaderItem;
}

export interface IVariantListDownloaderItemFactory {
    create(info: IHlsStreamInfo, id: string, name: string, targetPath: string): IVariantListDownloaderItem;
}

export interface IMapDownloaderFactory {
    create(info: IHlsMap, targetPath: string, id: string): IMapDownloader;
}

export interface IMediaDownloaderFactory {
    create(info: IHlsInfo, targetPath: string, sequence: number): IMediaDownloader;
}


export interface IHlsMultiVariantListFactory {
    create(): IHlsMultiVariantList;
}

export interface IHlsStreamInfoFactory {
    create(): IHlsStreamInfo;
}

export interface IHlsMediaInfoFactory {
    create(): IHlsMediaInfo;
}

export interface IHlsPlaylistFactory {
    create(): IHlsPlaylist;
}

export interface IHlsInfoFactory {
    create(): IHlsInfo;
}

export interface IHlsKeyFactory {
    create(): IHlsKey;
}

export interface IHlsMapFactory {
    create(): IHlsMap;
}
