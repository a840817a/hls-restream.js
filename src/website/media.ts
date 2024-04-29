import {BaseHttpController, controller, httpGet, requestParam, response} from "inversify-express-utils";
import express from "express";
import {inject} from "inversify";
import {TYPES} from "../definition/types";
import {IStreamManager} from "../definition/interface/manager";
import {PlaylistType} from "../definition/enum";
import {IMultiVariantListDownloader, IPlaylistDownloader} from "../definition/interface/downloader";

@controller("/media")
export class MediaController extends BaseHttpController {
    public constructor(
        @inject(TYPES.StreamManager) private streamManager: IStreamManager
    ) {
        super();
    }

    @httpGet("/:id/:variant?/:file")
    private async GetVariantMediaData(@requestParam('id') id: string,
                                      @requestParam('variant') variant: string,
                                      @requestParam('file') file: string,
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

            const target = (downloader as IMultiVariantListDownloader).data.find(data => data.name == variant);
            if (target == undefined) {
                res.status(404).send('Not found');
                return;
            }

            downloader = target.playList;
        }

        let media = (downloader as IPlaylistDownloader).data.find(data => data.filename == file);
        if (media == undefined) {
            res.status(404).send('Not found');
            return;
        }

        while (media.downloading) {
            await this.Sleep(128);
        }

        return new Promise<void>((resolve, reject) => {
            res.sendFile(`${process.cwd()}/${downloader.fullPath}/${file}`, (err) => {
                if (!err) resolve()
                else reject(err)
            })
        })
    }

    private Sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}