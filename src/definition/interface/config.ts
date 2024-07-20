export interface IConfig {
    readonly PORT: number;
    readonly OUTPUT_PATH: string;
    readonly MAX_ERROR_RETRY: number;
    readonly MAX_CONCURRENT_DOWNLOADS: number;
}
