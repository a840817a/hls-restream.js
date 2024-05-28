import {IHlsInfo, IHlsPlaylist} from "../../definition/interface/hls";
import {IHlsInfoFactory, IHlsKeyFactory} from "../../definition/interface/factory";

export class HlsPlaylist implements IHlsPlaylist {
    version: number = 0;
    targetDuration: number = 0;
    mediaSequence: number = 1;
    playlistType: string = '';
    data: IHlsInfo[] = [];
    completed: boolean = false;

    constructor(private hlsInfoFactory: IHlsInfoFactory,
                private hlsKeyFactory: IHlsKeyFactory) {
    }

    parse(hlsContent: string, uriBase?: string) {
        if (hlsContent == undefined) throw Error('Input undefined!');

        const data = hlsContent.split('\n');
        if (data[0] != '#EXTM3U') throw Error('Invalidate hls data!');

        let current = this.hlsInfoFactory.create();

        for (const element of data) {
            if (element.startsWith("#")) {
                let tag = element.split(/:(.*)/s);

                switch (tag[0].toUpperCase()) {
                    case '#EXTM3U':
                        continue;
                    case '#EXT-X-VERSION':
                        this.version = parseInt(tag[1]);
                        break;
                    case '#EXT-X-TARGETDURATION':
                        this.targetDuration = parseInt(tag[1]);
                        break;
                    case '#EXT-X-MEDIA-SEQUENCE':
                        this.mediaSequence = parseInt(tag[1]);
                        break;
                    case '#EXT-X-PLAYLIST-TYPE':
                        this.playlistType = tag[1];
                        break;
                    case '#EXT-X-KEY':
                        let key = this.hlsKeyFactory.create();
                        key.parse(tag[1]);
                        current.key = key;
                        break;
                    case '#EXTINF':
                        current.duration = parseFloat(tag[1].replace(',', ''));
                        break;
                    case '#EXT-X-ENDLIST':
                        this.completed = true;
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
                current = this.hlsInfoFactory.create();
            }
        }
    }
}
