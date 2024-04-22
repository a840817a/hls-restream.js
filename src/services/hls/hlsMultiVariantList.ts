import {IHlsMultiVariantList, IHlsStreamInfo} from "../../definition/interface/hls";
import {IHlsStreamInfoFactory} from "../../definition/interface/factory";

export class HlsMultiVariantList implements IHlsMultiVariantList {
    version: number = 0;
    independentSegments: boolean = false;
    data: IHlsStreamInfo[] = [];

    constructor(private hlsStreamInfoFactory: IHlsStreamInfoFactory) {
    }

    parse(hlsContent: string, uriBase?: string) {
        const data = hlsContent.split('\n');
        if (data[0] != '#EXTM3U') throw Error('Invalidate hls data!');

        let current = this.hlsStreamInfoFactory.create();

        for (const element of data) {
            if (element.startsWith("#")) {
                let tag = element.split(/:(.*)/s);

                switch (tag[0].toUpperCase()) {
                    case '#EXTM3U':
                        continue;
                    case '#EXT-X-VERSION':
                        this.version = parseInt(tag[1]);
                        break;
                    case '#EXT-X-INDEPENDENT-SEGMENTS':
                        this.independentSegments = true;
                        break;
                    case '#EXT-X-STREAM-INF':
                        current.parseInfo(tag[1]);
                        break;
                    default:
                        console.log(`Unknown Tag ${element}.`);
                }
            } else if (element.trim().length != 0) {
                if (uriBase == undefined || element.match(/^(?:[a-z+]+:)?\/\//)) {
                    current.uri = element;
                } else {
                    current.uri = uriBase + element;
                }
                this.data.push(current);
                current = this.hlsStreamInfoFactory.create();
            }
        }
    }
}