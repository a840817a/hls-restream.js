import {
    IMediaDownloader,
    IMultiVariantListDownloader,
    IPlaylistDownloader,
    IVariantListDownloaderItem
} from "./downloader";
import {IDownloadJob} from "./manager";
import {HlsStreamInfo} from "../../services/hls/hlsStreamInfo";
import {IHlsInfo, IHlsKey, IHlsMultiVariantList, IHlsPlaylist, IHlsStreamInfo} from "./hls";
import {HlsInfo} from "../../services/hls/hlsInfo";

export interface IDownloadJobFactory {
    create(title: string | undefined, sourceUrl: string): IDownloadJob;
}


export interface IMultiVariantListDownloaderFactory {
    create(originalUri: string, targetPath: string, source?: string): IMultiVariantListDownloader;
}

export interface IPlaylistDownloaderFactory {
    create(originalUri: string, targetPath: string, source?: string): IPlaylistDownloader;
}

export interface IVariantListDownloaderItemFactory {
    create(info: HlsStreamInfo, name: string, targetPath: string): IVariantListDownloaderItem;
}

export interface IMediaDownloaderFactory {
    create(info: HlsInfo, targetPath: string, sequence: number): IMediaDownloader;
}


export interface IHlsMultiVariantListFactory {
    create(): IHlsMultiVariantList;
}

export interface IHlsStreamInfoFactory {
    create(): IHlsStreamInfo;
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