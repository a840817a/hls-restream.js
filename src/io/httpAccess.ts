import axios from "axios";
import * as https from "node:https";

import {injectable} from "inversify";

import {IHttpAccess} from "../definition/interface/io";

@injectable()
export class HttpAccess implements IHttpAccess {
    private readonly client = axios.create({
        timeout: 30000,
        httpsAgent: new https.Agent({ keepAlive: true }),
    });

    async download(url: string) {
        try {
            const response = await this.client.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async downloadBinary(url: string) {
        try {
            const response = await this.client.get(url, {responseType: 'arraybuffer'});
            return response.data as Buffer;
        } catch (error) {
            throw error;
        }
    }
}
