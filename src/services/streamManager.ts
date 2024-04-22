import {inject, injectable} from "inversify";

import {TYPES} from "../definition/types";
import {ILogger} from "../definition/interface/io";
import {IStreamManager, IDownloadJob} from "../definition/interface/manager";
import {IDownloadJobFactory} from "../definition/interface/factory";

@injectable()
export class StreamManager implements IStreamManager {
    private streamList: { [id: string]: IDownloadJob } = {};

    constructor(@inject(TYPES.Logger) private logger: ILogger,
                @inject(TYPES.DownloadJobFactory) private downloadJobFactory: IDownloadJobFactory) {
        this.logger.setClassName((this as any).constructor.name);
    }

    get(id: string): IDownloadJob {
        return this.streamList[id];
    }

    add(title: string | undefined, url: string): IDownloadJob {
        const job = this.downloadJobFactory.create(title, url);
        this.streamList[job.id] = job;
        return job;
    }

    getList(): IDownloadJob[] {
        return Object.values(this.streamList);
    }
}