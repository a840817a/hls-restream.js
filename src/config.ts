import {injectable} from "inversify";

import {IConfig} from "./definition/interface/config";

@injectable()
export class Config implements IConfig {
    readonly OUTPUT_PATH = 'archive/';
    readonly MAX_ERROR_RETRY = 3;
    readonly MAX_CONCURRENT_DOWNLOADS = 16;
}