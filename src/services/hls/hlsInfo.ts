import {IHlsInfo, IHlsKey} from "../../definition/interface/hls";

export class HlsInfo implements IHlsInfo {
    duration: number = 0;
    key?: IHlsKey;
    uri: string = '';
}