import axios from "axios";

import {injectable} from "inversify";

import {IHttpAccess} from "../definition/interface/io";

@injectable()
export class HttpAccess implements IHttpAccess {
    async download(url: string) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async downloadBinary(url: string) {
        try {
            const response = await axios.get(url, {responseType: 'arraybuffer'});
            return response.data as Buffer;
        } catch (error) {
            throw error;
        }
    }
}