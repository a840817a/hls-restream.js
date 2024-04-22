import express from "express";
import {inject} from "inversify";
import {BaseHttpController, controller, httpGet, request, response} from "inversify-express-utils";

import {TYPES} from "../definition/types";
import {PlaylistType} from "../definition/enum";
import {IStreamManager} from "../definition/interface/manager";
import {IMultiVariantListDownloader, IPlaylistDownloader} from "../definition/interface/downloader";

@controller("/stream")
export class StreamController extends BaseHttpController {
    public constructor(
        @inject(TYPES.StreamManager) private streamManager: IStreamManager
    ) {
        super();
    }

    @httpGet("/:name/:file")
    private async GetPlayListData(@request() req: express.Request, @response() res: express.Response) {
        const name = req.params.name;
        const file = req.params.file;

        const target = this.streamManager.get(name);
        const downloader = target.downloader;

        if (downloader == undefined) {
            res.status(404).send('Not found');
            return;
        }

        if (file == 'index.m3u8') {
            res.setHeader('content-type', 'application/x-mpegURL');
            res.send(downloader.generateIndex());
            return;
        }

        if (!(downloader.type == PlaylistType.playlist)) {
            res.status(404).send('Not found');
            return;
        }

        const media = (target.downloader as IPlaylistDownloader).data.find(data => data.filename == file);
        if (media == undefined) {
            res.status(404).send('Not found');
            return;
        }

        while (media.downloading) {
            await this.Sleep(128);
        }

        return new Promise<void>((resolve, reject) => {
            res.sendFile(`${process.cwd()}/${(target.downloader as IPlaylistDownloader).fullPath}/${file}`, (err) => {
                if (!err) resolve()
                else reject(err)
            })
        })
    }

    @httpGet("/:name/:variant/:file")
    private async GetPlayListVariantData(@request() req: express.Request, @response() res: express.Response) {
        const name = req.params.name;
        const variant = req.params.variant;
        const file = req.params.file;

        const targetJob = this.streamManager.get(name);
        const downloader = targetJob.downloader;

        if (downloader == undefined || !(downloader.type == PlaylistType.multiVariantPlaylist)) {
            res.status(404).send('Not found');
            return;
        }

        const target = (targetJob.downloader as IMultiVariantListDownloader).data.find(data => data.name == variant);
        if (target == undefined) {
            res.status(404).send('Not found');
            return;
        }

        if (file == 'index.m3u8') {
            res.setHeader('content-type', 'application/x-mpegURL');
            res.send(target.playList.generateIndex());
            return;
        }

        const media = target.playList.data.find(data => data.filename == file);
        if (media == undefined) {
            res.status(404).send('Not found');
            return;
        }

        while (media.downloading) {
            await this.Sleep(128);
        }

        return new Promise<void>((resolve, reject) => {
            res.sendFile(`${process.cwd()}/${target.playList.fullPath}/${file}`, (err) => {
                if (!err) resolve()
                else reject(err)
            })
        })
    }

    private Sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}