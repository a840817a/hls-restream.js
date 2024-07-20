import {injectable} from "inversify";

import {IConfig} from "./definition/interface/config";

@injectable()
export class Config implements IConfig {
    readonly PORT = parseInt(process.env.PORT ?? "") || 5000;
    readonly OUTPUT_PATH = process.env.OUTPUT_PATH || 'output/';
    readonly MAX_ERROR_RETRY = parseInt(process.env.MAX_ERROR_RETRY ?? "") || 3;
    readonly MAX_CONCURRENT_DOWNLOADS = parseInt(process.env.MAX_CONCURRENT_DOWNLOADS ?? "") || 16;
}
