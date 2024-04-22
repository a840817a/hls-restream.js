export const TYPES = {
    Config: Symbol.for("IConfig"),
    Logger: Symbol.for("ILogger"),
    HttpAccess: Symbol.for("IHttpAccess"),
    FileAccess: Symbol.for("IFileAccess"),

    StreamManager: Symbol.for("IStreamManager"),
    DownloadManager: Symbol.for("IDownloadManager"),
    KeyManager: Symbol.for("IKeyManager"),

    DownloadJob: Symbol.for("IDownloadJob"),

    DownloadJobFactory: Symbol.for("IDownloadJobFactory"),
    MultiVariantListDownloaderFactory: Symbol.for("IMultiVariantListDownloaderFactory"),
    PlaylistDownloaderFactory: Symbol.for("IPlaylistDownloaderFactory"),
    VariantListDownloaderItemFactory: Symbol.for("IVariantListDownloaderItemFactory"),
    MediaDownloaderFactory: Symbol.for("IMediaDownloaderFactory"),

    HlsMultiVariantListFactory: Symbol.for("IHlsMultiVariantListFactory"),
    HlsStreamInfoFactory: Symbol.for("IHlsStreamInfoFactory"),
    HlsPlaylistFactory: Symbol.for("IHlsPlaylistFactory"),
    HlsInfoFactory: Symbol.for("IHlsInfoFactory"),
    HlsKeyFactory: Symbol.for("IHlsKeyFactory"),
};
