import {DownloadStatus, PlaylistType} from "../enum";
import {IHlsFile, IHlsInfo, IHlsMultiVariantList, IHlsPlaylist, IHlsStreamInfo} from "./hls";

export interface IHlsDownloader {
    type: PlaylistType;
    source?: IHlsFile;
    targetPath: string;
    originalUri: string;
    fullPath: string;

    generateIndex: (mediaPathPrefix?: string, windowSize?: number) => string;
}

export interface IMultiVariantListDownloader extends IHlsDownloader {
    source?: IHlsMultiVariantList;
    data: IVariantListDownloaderItem[];

    saveFile(): Promise<void>;
}

export interface IPlaylistDownloader extends IHlsDownloader {
    source?: IHlsPlaylist;
    data: IMediaDownloader[];

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