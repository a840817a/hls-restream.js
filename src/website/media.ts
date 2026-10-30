import {Controller, Get, Params, Response} from "@inversifyjs/http-core";
import express from "express";
import {inject} from "inversify";
import {TYPES} from "../definition/types";
import {IStreamManager} from "../definition/interface/manager";
import {PlaylistType} from "../definition/enum";
import {IMultiVariantListDownloader, IPlaylistDownloader} from "../definition/interface/downloader";

@Controller("/media")
export class MediaController {
    public constructor(
        @inject(TYPES.StreamManager) private streamManager: IStreamManager
    ) {
    }

    @Get("/:id{/:variant}/:file")
    private async GetVariantMediaData(@Params({name: 'id'}) id: string,
                                      @Params({name: 'variant'}) variant: string,
                                      @Params({name: 'file'}) file: string,
                                      @Response() res: express.Response) {
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

        let playlist = (downloader as IPlaylistDownloader);

        let media = file.startsWith("map") ? playlist.map : playlist.data.find(data => data.filename == file);
        if (media == undefined) {
            res.status(404).send('Not found');
            return;
        }

        while (media.downloading) {
            await this.Sleep(128);
        }

        return new Promise<void>((resolve, reject) => {
            let path = `${downloader.fullPath}/${file}`;
            if (!path.startsWith('/')) path = `${process.cwd()}/` + path;

            res.sendFile(path, (err) => {
                if (!err) resolve()
                else reject(err)
            })
        });
    }

    private Sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
