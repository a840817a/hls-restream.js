export class UrlUtilities {
    static getUrlBase(url: string) {
        return url.split(/[^\/]*$/)[0];
    }

    static getUrlExtension(url: string) {
        return url.split(/[#?]/)[0].split('.').pop()?.trim();
    }

    static getUrlFilename(url: string) {
        return url.split(/[.][^.]*$/)[0].split('/').pop()?.trim();
    }
}
