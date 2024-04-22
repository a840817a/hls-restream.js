import {Logger as tsLog} from "tslog";

import {injectable} from "inversify";

import {ILogger} from "../definition/interface/io";

@injectable()
export class Logger implements ILogger {
    private logger = new tsLog({
        hideLogPositionForProduction: true,
    });
    private className: string = '';

    setClassName(className: string): void {
        this.className = className;
    }

    logSilly(...args: unknown[]): any {
        return this.logger.silly(`[${this.className}]`, ...args);
    }

    logTrace(...args: unknown[]): any {
        return this.logger.trace(`[${this.className}]`, ...args);
    }

    logDebug(...args: unknown[]): any {
        return this.logger.debug(`[${this.className}]`, ...args);
    }

    logInfo(...args: unknown[]): any {
        return this.logger.info(`[${this.className}]`, ...args);
    }

    logWarn(...args: unknown[]): any {
        return this.logger.warn(`[${this.className}]`, ...args);
    }

    logError(...args: unknown[]): any {
        return this.logger.error(`[${this.className}]`, ...args);
    }

    logFatal(...args: unknown[]): any {
        return this.logger.fatal(`[${this.className}]`, ...args);
    }
}