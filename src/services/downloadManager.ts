import {inject, injectable} from "inversify";

import {TYPES} from "../definition/types";
import {IConfig} from "../definition/interface/config";
import {IHttpAccess, ILogger} from "../definition/interface/io";
import {IDownloadManager} from "../definition/interface/manager";

class DownloadTask {
    constructor(
        public url: string,
        public priority: number = 20,
        public type: 'normal' | 'binary' = 'normal',
        public headers: string | undefined = undefined,
    ) {
    }
}

@injectable()
export class DownloadManager implements IDownloadManager {
    private readonly maxConcurrentDownloads: number;
    private downloadQueue: Array<{ task: DownloadTask; resolve: Function; reject: Function }> = [];
    private activeDownloads: Set<DownloadTask> = new Set();

    constructor(@inject(TYPES.Config) private config: IConfig,
                @inject(TYPES.Logger) private logger: ILogger,
                @inject(TYPES.HttpAccess) private httpAccess: IHttpAccess) {
        this.logger.setClassName((this as any).constructor.name);
        this.maxConcurrentDownloads = this.config.MAX_CONCURRENT_DOWNLOADS;
    }

    async get(url: string, priority: number = 20, headers?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.downloadQueue.push({task: new DownloadTask(url, priority, 'normal', headers), resolve, reject});
            this.downloadQueue.sort((a, b) => b.task.priority - a.task.priority);
            this.processQueue();
        });
    }

    async getBinary(url: string, priority: number = 20, headers?: string): Promise<Buffer | undefined> {
        return new Promise((resolve, reject) => {
            this.downloadQueue.push({task: new DownloadTask(url, priority, 'binary', headers), resolve, reject});
            this.downloadQueue.sort((a, b) => b.task.priority - a.task.priority);
            this.processQueue();
        });
    }

    private processQueue(): void {
        while (this.activeDownloads.size < this.maxConcurrentDownloads && this.downloadQueue.length > 0) {
            const {task, resolve, reject} = this.downloadQueue.shift()!;
            this.activeDownloads.add(task);
            this.startDownload(task, resolve, reject);
        }
    }

    private startDownload(task: DownloadTask, resolve: Function, reject: Function): void {
        if (task.type === 'binary') {
            this.downloadBinary(task.url, resolve, reject, task.headers).then(() => {
                this.activeDownloads.delete(task);
                this.processQueue();
            });
        } else {
            this.download(task.url, resolve, reject, task.headers).then(() => {
                this.activeDownloads.delete(task);
                this.processQueue();
            });
        }
    }

    async download(url: string, resolve: Function, reject: Function, headers?: string) {
        try {
            resolve(await this.httpAccess.download(url, headers));
        } catch (error) {
            reject(error);
        }
    }

    async downloadBinary(url: string, resolve: Function, reject: Function, headers?: string) {
        try {
            resolve(await this.httpAccess.downloadBinary(url, headers));
        } catch (error) {
            reject(error);
        }
    }
}
