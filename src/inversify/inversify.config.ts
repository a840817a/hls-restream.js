import "reflect-metadata";

import {Container} from "inversify";

import {TYPES} from "../definition/types";
import {IConfig} from "../definition/interface/config";
import {IFileAccess, IHttpAccess, ILogger} from "../definition/interface/io";
import {
    IDownloadManager, IKeyManager,
    IStreamManager
} from "../definition/interface/manager";
import {
    IDownloadJobFactory,
    IHlsInfoFactory,
    IHlsKeyFactory, IHlsMapFactory, IHlsMediaInfoFactory,
    IHlsMultiVariantListFactory,
    IHlsPlaylistFactory,
    IHlsStreamInfoFactory, IMapDownloaderFactory,
    IMediaDownloaderFactory, IMediaListDownloaderItemFactory,
    IMultiVariantListDownloaderFactory,
    IPlaylistDownloaderFactory,
    IVariantListDownloaderItemFactory
} from "../definition/interface/factory";

import {Config} from "../config";
import {Logger} from "../io/logger";
import {HttpAccess} from "../io/httpAccess";
import {FileAccess} from "../io/fileAccess";

import {StreamManager} from "../services/streamManager";
import {DownloadManager} from "../services/downloadManager";
import {KeyManager} from "../services/keyManager";
import {
    DownloadJobFactory, MapDownloaderFactory,
    MediaDownloaderFactory, MediaListDownloaderItemFactory, MultiVariantListDownloaderFactory,
    PlaylistDownloaderFactory,
    VariantListDownloaderItemFactory
} from "./factory/downloader";
import {
    HlsInfoFactory,
    HlsKeyFactory, HlsMapFactory, HlsMediaInfoFactory,
    HlsMultiVariantListFactory,
    HlsPlaylistFactory,
    HlsStreamInfoFactory
} from "./factory/hls";
let container = new Container();

container.bind<IConfig>(TYPES.Config).to(Config).inSingletonScope();
container.bind<ILogger>(TYPES.Logger).to(Logger);
container.bind<IHttpAccess>(TYPES.HttpAccess).to(HttpAccess).inSingletonScope();
container.bind<IFileAccess>(TYPES.FileAccess).to(FileAccess);

container.bind<IStreamManager>(TYPES.StreamManager).to(StreamManager).inSingletonScope();
container.bind<IDownloadManager>(TYPES.DownloadManager).to(DownloadManager).inSingletonScope();
container.bind<IKeyManager>(TYPES.KeyManager).to(KeyManager).inSingletonScope();

container.bind<IDownloadJobFactory>(TYPES.DownloadJobFactory).to(DownloadJobFactory)
container.bind<IMultiVariantListDownloaderFactory>(TYPES.MultiVariantListDownloaderFactory).to(MultiVariantListDownloaderFactory)
container.bind<IPlaylistDownloaderFactory>(TYPES.PlaylistDownloaderFactory).to(PlaylistDownloaderFactory)
container.bind<IMediaListDownloaderItemFactory>(TYPES.MediaListDownloaderItemFactory).to(MediaListDownloaderItemFactory)
container.bind<IVariantListDownloaderItemFactory>(TYPES.VariantListDownloaderItemFactory).to(VariantListDownloaderItemFactory)
container.bind<IMapDownloaderFactory>(TYPES.MapDownloaderFactory).to(MapDownloaderFactory)
container.bind<IMediaDownloaderFactory>(TYPES.MediaDownloaderFactory).to(MediaDownloaderFactory)

container.bind<IHlsMultiVariantListFactory>(TYPES.HlsMultiVariantListFactory).to(HlsMultiVariantListFactory)
container.bind<IHlsMediaInfoFactory>(TYPES.HlsMediaInfoFactory).to(HlsMediaInfoFactory)
container.bind<IHlsStreamInfoFactory>(TYPES.HlsStreamInfoFactory).to(HlsStreamInfoFactory)
container.bind<IHlsPlaylistFactory>(TYPES.HlsPlaylistFactory).to(HlsPlaylistFactory)
container.bind<IHlsInfoFactory>(TYPES.HlsInfoFactory).to(HlsInfoFactory)
container.bind<IHlsKeyFactory>(TYPES.HlsKeyFactory).to(HlsKeyFactory)
container.bind<IHlsMapFactory>(TYPES.HlsMapFactory).to(HlsMapFactory)

export { container };
