import {IHlsStreamInfo} from "../../definition/interface/hls";

export class HlsStreamInfo implements IHlsStreamInfo {
    bandwidth: number = 0;
    averageBandwidth: number = 0;
    codecs: string = '';
    resolution: string = '';
    frameRate: number = 0;
    uri?: string;

    constructor() {
    }

    parseInfo(info: string) {
        const split = info.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        for (const item of split) {
            let working = item.split('=');

            switch (working[0].toUpperCase()) {
                case 'BANDWIDTH':
                    this.bandwidth = parseInt(working[1]);
                    break;
                case 'AVERAGE-BANDWIDTH':
                    this.averageBandwidth = parseInt(working[1]);
                    break;
                case 'CODECS':
                    this.codecs = working[1].replace(/"/g, '');
                    break;
                case 'RESOLUTION':
                    this.resolution = working[1];
                    break;
                case 'FRAME-RATE':
                    this.frameRate = parseFloat(working[1]);
                    break;
                default:
                    console.log(`Unknown Stream Info Item ${working[0]}.`);
            }
        }
    }
}