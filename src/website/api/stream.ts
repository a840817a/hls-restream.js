import {inject} from "inversify";
import {BaseHttpController, controller, httpGet, httpPost, requestBody, requestParam} from "inversify-express-utils";

import {TYPES} from "../../definition/types";
import {IStreamManager} from "../../definition/interface/manager";

@controller("/api/stream")
export class StreamManagerController extends BaseHttpController {
    public constructor(
        @inject(TYPES.StreamManager) private streamManager: IStreamManager
    ) {
        super();
    }

    @httpGet("/")
    private getList() {
        return this.json(this.streamManager.getList().map((job) => {
            return {
                id: job.id,
                title: job.title,
                sourceUrl: job.sourceUrl,
                playerLink: job.playerLink,
            };
        }))
    }

    @httpGet("/:id")
    private getById(@requestParam('id') id: string) {
        const job = this.streamManager.get(id);
        if (job == undefined) {
            return this.notFound();
        }

        return this.json({
            id: job.id,
            title: job.title,
            sourceUrl: job.sourceUrl,
            playerLink: job.playerLink,
        })
    }

    @httpPost("/")
    private add(@requestBody() input: { name?: string; url?: string; }) {
        if (input.url == undefined) {
            return this.badRequest('Missing Parameter');
        }

        try {
            const job = this.streamManager.add(input.name, input.url);
            return this.json({
                id: job.id,
                title: job.title,
                sourceUrl: job.sourceUrl,
                playerLink: job.playerLink,
            });
        }
        catch (error) {
            return this.badRequest('Can not get hls');
        }
    }
}
