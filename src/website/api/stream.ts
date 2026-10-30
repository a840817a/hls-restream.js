import {inject} from "inversify";
import {BadRequestHttpResponse, Body, Controller, Get, NotFoundHttpResponse, Params, Post} from "@inversifyjs/http-core";

import {TYPES} from "../../definition/types";
import {IStreamManager} from "../../definition/interface/manager";

@Controller("/api/stream")
export class StreamManagerController {
    public constructor(
        @inject(TYPES.StreamManager) private streamManager: IStreamManager
    ) {
    }

    @Get("/")
    private getList() {
        return this.streamManager.getList().map((job) => {
            return {
                id: job.id,
                title: job.title,
                sourceUrl: job.sourceUrl,
                playerLink: job.playerLink,
            };
        })
    }

    @Get("/:id")
    private getById(@Params({name: 'id'}) id: string) {
        const job = this.streamManager.get(id);
        if (job == undefined) {
            throw new NotFoundHttpResponse();
        }

        return {
            id: job.id,
            title: job.title,
            sourceUrl: job.sourceUrl,
            playerLink: job.playerLink,
        }
    }

    @Post("/")
    private add(@Body() input: { name?: string; url?: string; headers?: string; }) {
        if (input.url == undefined) {
            throw new BadRequestHttpResponse('Missing Parameter');
        }

        try {
            const job = this.streamManager.add(input.name, input.url, input.headers);
            return {
                id: job.id,
                title: job.title,
                sourceUrl: job.sourceUrl,
                playerLink: job.playerLink,
            };
        }
        catch (error) {
            throw new BadRequestHttpResponse('Can not get hls');
        }
    }
}
