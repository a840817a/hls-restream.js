import {DownloadStatus, PlaylistType} from "../enum";
import {IHlsFile, IHlsInfo, IHlsMultiVariantList, IHlsPlaylist, IHlsStreamInfo} from "./hls";

export interface IHlsDownloader {
    type: PlaylistType;
    source?: IHlsFile;
    targetPath: string;
    originalUri: string;
    generateIndex: (windowSize?: number) => string;
}

export interface IMultiVariantListDownloader extends IHlsDownloader {
    source?: IHlsMultiVariantList;
    data: IVariantListDownloaderItem[];
    fullPath: string;

    generateIndex(windowSize?: number): string;

    saveFile(): Promise<void>;
}

export interface IPlaylistDownloader extends IHlsDownloader {
    source?: IHlsPlaylist;
    data: IMediaDownloader[];
    fullPath: string;

    generateIndex(windowSize?: number): string;

    saveFile(): Promise<void>;
}

export interface IMediaDownloader {
    info: IHlsInfo;
    status: DownloadStatus;
    sequence: number;
    targetPath: string;
    fileExtension: string;
    filename: string;
    fullPath: string;
    ready: boolean;
    downloading: boolean;
}

export interface IVariantListDownloaderItem {
    name: string;
    info: IHlsStreamInfo;
    playList: IPlaylistDownloader;
}