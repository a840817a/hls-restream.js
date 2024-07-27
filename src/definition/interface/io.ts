export interface ILogger {
    setClassName(className: string): void;

    logSilly(...args: unknown[]): any;

    logTrace(...args: unknown[]): any;

    logDebug(...args: unknown[]): any;

    logInfo(...args: unknown[]): any;

    logWarn(...args: unknown[]): any;

    logError(...args: unknown[]): any;

    logFatal(...args: unknown[]): any;
}

export interface IHttpAccess {
    download(url: string, rawError?: boolean): Promise<any>;

    downloadBinary(url: string, rawError?: boolean): Promise<Buffer | undefined>;
}

export interface IFileAccess {
    checkPathExists(path: string): boolean;

    createDirectoryRecursive(path: string): string | undefined;

    saveFile(path: string, data: string | NodeJS.ArrayBufferView): void;
}
