export interface IHlsFile {
    version: number;
    data: IHlsStreamInfo[] | IHlsInfo[];

    parse(hlsContent: string, uriBase?: string): void;
}

export interface IHlsMultiVariantList extends IHlsFile {
    version: number;
    independentSegments: boolean;
    data: IHlsStreamInfo[];
}

export interface IHlsStreamInfo {
    bandwidth: number;
    averageBandwidth: number;
    codecs: string;
    resolution: string;
    frameRate: number;
    uri?: string;

    parseInfo(info: string): void;
}

export interface IHlsPlaylist extends IHlsFile {
    version: number;
    targetDuration: number;
    mediaSequence: number;
    playlistType: string;
    data: IHlsInfo[];
    completed: boolean;
}

export interface IHlsInfo {
    duration: number;
    key?: IHlsKey;
    uri: string;
}

export interface IHlsKey {
    method: string;
    uri: string;
    iv: string;

    parse(keyData: string): void;
}