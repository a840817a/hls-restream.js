import {IHlsMediaInfo} from "../../definition/interface/hls";

export class HlsMediaInfo implements IHlsMediaInfo {
    type: string = '';
    groupId: string = '';
    name: string = '';
    language?: string;
    assocLanguage?: string;
    default?: boolean;
    autoSelect?: boolean;
    forced?: boolean;
    inStreamId?: string;
    characteristics?: string;
    channels?: string;
    uri?: string;

    constructor() {
    }

    parseInfo(info: string, uriBase?: string) {
        const split = info.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        for (const item of split) {
            let working = item.split(/=(.*)/);

            switch (working[0].toUpperCase()) {
                case 'TYPE':
                    this.type = working[1];
                    break;
                case 'GROUP-ID':
                    this.groupId = working[1].replace(/"/g, '');
                    break;
                case 'NAME':
                    this.name = working[1].replace(/"/g, '');
                    break;
                case 'LANGUAGE':
                    this.language = working[1].replace(/"/g, '');
                    break;
                case 'ASSOC-LANGUAGE':
                    this.assocLanguage = working[1].replace(/"/g, '');
                    break;
                case 'DEFAULT':
                    switch (working[1]) {
                        case 'YES':
                            this.default = true;
                            break;
                        case 'NO':
                            this.default = false;
                            break;
                    }
                    break;
                case 'AUTOSELECT':
                    switch (working[1]) {
                        case 'YES':
                            this.autoSelect = true;
                            break;
                        case 'NO':
                            this.autoSelect = false;
                            break;
                    }
                    break;
                case 'FORCED':
                    switch (working[1]) {
                        case 'YES':
                            this.forced = true;
                            break;
                        case 'NO':
                            this.forced = false;
                            break;
                    }
                    break;
                case 'INSTREAM-ID':
                    this.inStreamId = working[1].replace(/"/g, '');
                    break;
                case 'CHARACTERISTICS':
                    this.characteristics = working[1].replace(/"/g, '');
                    break;
                case 'CHANNELS':
                    this.channels = working[1].replace(/"/g, '');
                    break;
                case 'URI':
                    let uri = working[1].replace(/"/g, '');
                    if (uriBase == undefined || uri.match(/^(?:[a-z+]+:)?\/\//)) {
                        this.uri = uri;
                    } else {
                        this.uri = uriBase + uri;
                    }
                    break;
                default:
                    console.log(`Unknown Media Info Item ${working[0]}.`);
            }
        }
    }
}
