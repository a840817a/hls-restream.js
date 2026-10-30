import {Controller, Get, Params, Response} from "@inversifyjs/http-core";
import express from "express";
import {inject} from "inversify";

import {TYPES} from "../definition/types";
import {IStreamManager} from "../definition/interface/manager";

@Controller("/player")
export class PlayerController {
    public constructor(
        @inject(TYPES.StreamManager) private streamManager: IStreamManager
    ) {
    }

    @Get("/:id")
    private async play(@Params({name: 'id'}) id: string, @Response() res: express.Response) {
        const job = this.streamManager.get(id);
        if (job == undefined) {
            res.status(404).send('Not found');
            return;
        }

        res.render("player", {
            title: job.title,
            path: `/stream/${id}/index.m3u8`
        });
    }
}