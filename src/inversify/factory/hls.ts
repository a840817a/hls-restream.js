import {inject, injectable} from "inversify";

import {TYPES} from "../../definition/types";
import {
    IHlsInfo,
    IHlsKey,
    IHlsMediaInfo,
    IHlsMultiVariantList,
    IHlsPlaylist,
    IHlsStreamInfo
} from "../../definition/interface/hls";

import {
    IHlsInfoFactory,
    IHlsKeyFactory, IHlsMapFactory, IHlsMediaInfoFactory,
    IHlsMultiVariantListFactory,
    IHlsPlaylistFactory,
    IHlsStreamInfoFactory
} from "../../definition/interface/factory";
import {HlsMultiVariantList} from "../../services/hls/hlsMultiVariantList";
import {HlsMediaInfo} from "../../services/hls/hlsMediaInfo";
import {HlsStreamInfo} from "../../services/hls/hlsStreamInfo";
import {HlsKey} from "../../services/hls/hlsKey";
import {HlsPlaylist} from "../../services/hls/hlsPlaylist";
import {HlsInfo} from "../../services/hls/hlsInfo";
import {HlsMap} from "../../services/hls/hlsMap";

@injectable()
export class HlsMultiVariantListFactory implements IHlsMultiVariantListFactory {
    constructor(@inject(TYPES.HlsStreamInfoFactory) private hlsStreamInfoFactory: IHlsStreamInfoFactory,
                @inject(TYPES.HlsMediaInfoFactory) private hlsMediaInfoFactory: IHlsMediaInfoFactory) {
    }

    create(): IHlsMultiVariantList {
        return new HlsMultiVariantList(
            this.hlsStreamInfoFactory,
            this.hlsMediaInfoFactory
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
export class HlsMediaInfoFactory implements IHlsMediaInfoFactory {
    constructor() {
    }

    create(): IHlsMediaInfo {
        return new HlsMediaInfo();
    }
}

@injectable()
export class HlsPlaylistFactory implements IHlsPlaylistFactory {
    constructor(@inject(TYPES.HlsInfoFactory) private hlsInfoFactory: IHlsInfoFactory,
                @inject(TYPES.HlsKeyFactory) private hlsKeyFactory: IHlsKeyFactory,
                @inject(TYPES.HlsMapFactory) private hlsMapFactory: IHlsMapFactory) {
    }

    create(): IHlsPlaylist {
        return new HlsPlaylist(
            this.hlsInfoFactory,
            this.hlsKeyFactory,
            this.hlsMapFactory
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
@injectable()
export class HlsMapFactory implements IHlsMapFactory {
    constructor() {
    }

    create(): HlsMap {
        return new HlsMap();
    }
}
