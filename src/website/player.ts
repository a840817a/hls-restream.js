import {BaseHttpController, controller, httpGet, requestParam, response} from "inversify-express-utils";
import express from "express";
import {inject} from "inversify";

import {TYPES} from "../definition/types";
import {IStreamManager} from "../definition/interface/manager";

@controller("/player")
export class PlayerController extends BaseHttpController {
    public constructor(
        @inject(TYPES.StreamManager) private streamManager: IStreamManager
    ) {
        super();
    }

    @httpGet("/:id")
    private async play(@requestParam('id') id: string, @response() res: express.Response) {
        const job = this.streamManager.get(id);
        if (job == undefined) {
            return this.notFound();
        }

        res.render("player", {
            title: job.title,
            path: `/stream/${id}/index.m3u8`
        });
    }
}