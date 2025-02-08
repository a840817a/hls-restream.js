import {IHlsDownloader} from "./downloader";

export interface IStreamManager {
    getList(): IDownloadJob[];

    get(id: string): IDownloadJob;
    add(title: string | undefined, url: string, headers?: string): IDownloadJob;
}

export interface IDownloadManager {
    get(url: string, priority?: number, headers?: string): Promise<any>;
    getBinary(url: string, priority?: number, headers?: string): Promise<Buffer | undefined>;
}

export interface IKeyManager {
    getKey(uri: string, headers?: string): Promise<any>;
}

export interface IDownloadJob {
    id: string;
    title: string | undefined;
    sourceUrl: string;
    playerLink: string;
    headers: string | undefined;
    downloader?: IHlsDownloader;
}


