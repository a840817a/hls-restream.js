import express from "express";
import {inject} from "inversify";
import {BaseHttpController, controller, httpGet, requestParam, response} from "inversify-express-utils";

import {TYPES} from "../definition/types";
import {PlaylistType} from "../definition/enum";
import {IStreamManager} from "../definition/interface/manager";
import {IMultiVariantListDownloader} from "../definition/interface/downloader";

@controller("/stream")
export class StreamController extends BaseHttpController {
    public constructor(
        @inject(TYPES.StreamManager) private streamManager: IStreamManager
    ) {
        super();
    }

    @httpGet("/:id/:variant?/index.m3u8")
    private async GetPlayListVariantData(@requestParam('id') id: string,
                                         @requestParam('variant') variant: string | undefined,
                                         @response() res: express.Response) {
        let downloader = this.streamManager.get(id).downloader;

        if (downloader == undefined) {
            res.status(404).send('Not found');
            return;
        }

        if (variant != undefined) {
            if (downloader.type != PlaylistType.multiVariantPlaylist) {
                res.status(404).send('Not found');
                return;
            }

            const targetPlaylist = (downloader as IMultiVariantListDownloader);

            const target = variant.startsWith("media") ?
                targetPlaylist.media.find(data => data.id == variant):
                targetPlaylist.data.find(data => data.id == variant);
            if (target == undefined) {
                res.status(404).send('Not found');
                return;
            }

            downloader = target.playList;
        }

        let mediaPrefix = `/media/${id}/`;
        if (variant != undefined) {
            mediaPrefix += `${variant}/`;
        }

        res.setHeader('content-type', 'application/x-mpegURL');
        res.send(downloader.generateIndex(mediaPrefix));
        return;
    }
}
