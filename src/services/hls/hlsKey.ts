import {IHlsKey} from "../../definition/interface/hls";

export class HlsKey implements IHlsKey {
    method: string = '';
    uri: string = '';
    iv: string = '';

    constructor() {
    }

    parse(keyData: string) {
        if (keyData == undefined) return;

        const split = keyData.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        for (const item of split) {
            let working = item.split('=');

            switch (working[0].toUpperCase()) {
                case 'METHOD':
                    this.method = working[1];
                    break;
                case 'URI':
                    this.uri = working[1].replace(/"/g, '');
                    break;
                case 'IV':
                    this.iv = working[1];
                    break;
                default:
                    console.log(`Unknown Key Item ${keyData}.`);
            }
        }
    }
}