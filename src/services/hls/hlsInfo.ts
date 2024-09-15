import {IHlsInfo, IHlsKey} from "../../definition/interface/hls";

export class HlsInfo implements IHlsInfo {
    duration: number = 0;
    byteRange?: string;
    key?: IHlsKey;
    uri: string = '';
}
