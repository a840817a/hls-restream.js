import {IHlsMap} from "../../definition/interface/hls";

export class HlsMap implements IHlsMap {
    uri: string = '';
    byteRange?: string = undefined;

    constructor() {
    }

    parse(keyData: string) {
        if (keyData == undefined) return;

        const split = keyData.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        for (const item of split) {
            let working = item.split(/=(.*)/);

            switch (working[0].toUpperCase()) {
                case 'URI':
                    this.uri = working[1].replace(/"/g, '');
                    break;
                case 'BYTERANGE':
                    this.byteRange = working[1].replace(/"/g, '');
                    break;
                default:
                    console.log(`Unknown Map Item ${keyData}.`);
            }
        }
    }
}
