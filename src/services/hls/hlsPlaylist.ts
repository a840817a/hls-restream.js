import {IHlsInfo, IHlsKey, IHlsMap, IHlsPlaylist} from "../../definition/interface/hls";
import {IHlsInfoFactory, IHlsKeyFactory, IHlsMapFactory} from "../../definition/interface/factory";

export class HlsPlaylist implements IHlsPlaylist {
    version: number = 0;
    targetDuration: number = 0;
    mediaSequence: number = 1;
    playlistType: string = '';
    allowCache?: boolean = undefined;
    map?: IHlsMap;
    data: IHlsInfo[] = [];
    completed: boolean = false;

    constructor(private hlsInfoFactory: IHlsInfoFactory,
                private hlsKeyFactory: IHlsKeyFactory,
                private hlsMapFactory: IHlsMapFactory) {
    }

    parse(hlsContent: string, uriBase?: string) {
        if (hlsContent == undefined) throw Error('Input undefined!');

        const data = hlsContent.split('\n');
        if (data[0] != '#EXTM3U') throw Error('Invalidate hls data!');

        let current = this.hlsInfoFactory.create();
        let currentKey: IHlsKey | undefined = undefined;

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
                    case '#EXT-X-ALLOW-CACHE':
                        switch (tag[1]) {
                            case 'YES':
                                this.allowCache = true;
                                break;
                            case 'NO':
                                this.allowCache = false;
                                break;
                        }
                        break;
                    case '#EXT-X-KEY':
                        let key = this.hlsKeyFactory.create();
                        key.parse(tag[1]);
                        currentKey = key;
                        if (uriBase != undefined && !currentKey.uri.match(/^(?:[a-z+]+:)?\/\//)) {
                            currentKey.uri = uriBase + currentKey.uri;
                        }
                        break;
                    case '#EXT-X-MAP':
                        let map = this.hlsMapFactory.create();
                        map.parse(tag[1]);
                        this.map = map;
                        if (uriBase != undefined && !this.map.uri.match(/^(?:[a-z+]+:)?\/\//)) {
                            this.map.uri = uriBase + this.map.uri;
                        }
                        break;
                    case '#EXTINF':
                        current.duration = parseFloat(tag[1].replace(',', ''));
                        break;
                    case '#EXT-X-BYTERANGE':
                        current.byteRange = tag[1];
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
                current.key = currentKey;
                this.data.push(current);
                current = this.hlsInfoFactory.create();
            }
        }
    }
}
