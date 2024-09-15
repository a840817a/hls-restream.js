export interface IHlsFile {
    version: number;
    data: IHlsStreamInfo[] | IHlsInfo[];

    parse(hlsContent: string, uriBase?: string): void;
}

export interface IHlsMultiVariantList extends IHlsFile {
    version: number;
    independentSegments: boolean;
    media: IHlsMediaInfo[];
    data: IHlsStreamInfo[];
}

export interface IHlsStreamInfo {
    bandwidth: number;
    averageBandwidth: number;
    codecs: string;
    resolution: string;
    frameRate: number;
    subtitles?: string;
    audio?: string;
    uri?: string;

    parseInfo(info: string): void;
}

export interface IHlsMediaInfo {
    type: string;
    groupId: string;
    name: string;
    language?: string;
    assocLanguage?: string;
    default?: boolean;
    autoSelect?: boolean;
    forced?: boolean;
    inStreamId?: string;
    characteristics?: string;
    channels?: string;
    uri?: string;

    parseInfo(info: string, uriBase?: string): void;
}

export interface IHlsPlaylist extends IHlsFile {
    version: number;
    targetDuration: number;
    mediaSequence: number;
    playlistType: string;
    allowCache?: boolean;
    map?: IHlsMap;
    data: IHlsInfo[];
    completed: boolean;
}

export interface IHlsInfo {
    duration: number;
    byteRange?: string;
    key?: IHlsKey;
    uri: string;
}

export interface IHlsKey {
    method: string;
    uri: string;
    iv: string;

    parse(keyData: string): void;
}

export interface IHlsMap {
    uri: string;
    byteRange?: string;

    parse(mapData: string): void;
}
