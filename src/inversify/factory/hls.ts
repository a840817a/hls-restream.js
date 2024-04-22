import {inject, injectable} from "inversify";

import {TYPES} from "../../definition/types";
import {IHlsInfo, IHlsKey, IHlsMultiVariantList, IHlsPlaylist, IHlsStreamInfo} from "../../definition/interface/hls";

import {
    IHlsInfoFactory,
    IHlsKeyFactory,
    IHlsMultiVariantListFactory,
    IHlsPlaylistFactory,
    IHlsStreamInfoFactory
} from "../../definition/interface/factory";
import {HlsMultiVariantList} from "../../services/hls/hlsMultiVariantList";
import {HlsStreamInfo} from "../../services/hls/hlsStreamInfo";
import {HlsKey} from "../../services/hls/hlsKey";
import {HlsPlaylist} from "../../services/hls/hlsPlaylist";
import {HlsInfo} from "../../services/hls/hlsInfo";

@injectable()
export class HlsMultiVariantListFactory implements IHlsMultiVariantListFactory {
    constructor(@inject(TYPES.HlsStreamInfoFactory) private hlsStreamInfoFactory: IHlsStreamInfoFactory) {
    }

    create(): IHlsMultiVariantList {
        return new HlsMultiVariantList(
            this.hlsStreamInfoFactory
        );
    }
}

@injectable()
export class HlsStreamInfoFactory implements IHlsStreamInfoFactory {
    constructor() {
    }

    create(): IHlsStreamInfo {
        return new HlsStreamInfo();
    }
}

@injectable()
export class HlsPlaylistFactory implements IHlsPlaylistFactory {
    constructor(@inject(TYPES.HlsInfoFactory) private hlsInfoFactory: IHlsInfoFactory,
                @inject(TYPES.HlsKeyFactory) private hlsKeyFactory: IHlsKeyFactory) {
    }

    create(): IHlsPlaylist {
        return new HlsPlaylist(
            this.hlsInfoFactory,
            this.hlsKeyFactory
        );
    }
}

@injectable()
export class HlsInfoFactory implements IHlsInfoFactory {
    constructor() {
    }

    create(): IHlsInfo {
        return new HlsInfo();
    }
}

@injectable()
export class HlsKeyFactory implements IHlsKeyFactory {
    constructor() {
    }

    create(): IHlsKey {
        return new HlsKey();
    }
}