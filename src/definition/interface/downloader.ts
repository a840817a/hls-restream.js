import {DownloadStatus, PlaylistType} from "../enum";
import {IHlsFile, IHlsInfo, IHlsMap, IHlsMediaInfo, IHlsMultiVariantList, IHlsPlaylist, IHlsStreamInfo} from "./hls";

export interface IHlsDownloader {
    type: PlaylistType;
    source?: IHlsFile;
    targetPath: string;
    originalUri: string;
    fullPath: string;

    generateIndex: (mediaPathPrefix?: string, windowSize?: number, saveFile?: boolean) => string;
}

export interface IMultiVariantListDownloader extends IHlsDownloader {
    source?: IHlsMultiVariantList;
    media: IMediaListDownloaderItem[];
    data: IVariantListDownloaderItem[];

    saveFile(): Promise<void>;
}

export interface IPlaylistDownloader extends IHlsDownloader {
    source?: IHlsPlaylist;
    map?: IMapDownloader;
    data: IMediaDownloader[];

    saveFile(): Promise<void>;
}

export interface IMapDownloader {
    info: IHlsMap;
    status: DownloadStatus;
    id: string;
    targetPath: string;
    fileExtension: string;
    filename: string;
    fullPath: string;
    ready: boolean;
    downloading: boolean;
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

export interface IMediaListDownloaderItem {
    id: string;
    name: string;
    info: IHlsMediaInfo;
    playList: IPlaylistDownloader;
}

export interface IVariantListDownloaderItem {
    id: string;
    name: string;
    info: IHlsStreamInfo;
    playList: IPlaylistDownloader;
}
