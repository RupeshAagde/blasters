export const ORIGINAL = 'ORIGINAL';

const IMAGE_SOURCE_TYPES = {
    HUFFER: 'huffer',
};

const IMAGE_SIZES = ['270x0', '540x0', '720x0'];

const IMAGE_TYPE_MAPPING = {
    [ORIGINAL]: 'original'
};

const HUFFER_IMAGE_SIZES = ['original'];

const HUFFER_TYPES = {
    width: 'w',
    height: 'h'
};

var CDN_MAP = {
    'http://cdn1.gofynd.com': 'https://d1e9fh8a7yurkp.cloudfront.net',
    'http://cdn2.gofynd.com': 'https://d39wr27bcdm9qi.cloudfront.net',
    'http://cdn3.gofynd.com': 'https://d2co8r51m5ca2d.cloudfront.net',
    'http://cdn4.gofynd.com': 'https://d2zv4gzhlr4ud6.cloudfront.net',
    //TODO: Dirty Hack Remove Later
    'http://cc.gofynd.com': 'https://d1e9fh8a7yurkp.cloudfront.net'
};

export function getUpdateCDNMapping(url) {
    for (let key in CDN_MAP) {
        if (url.startsWith(key)) {
            url = url.replace(key, CDN_MAP[key]);
        }
    }
    return url;
}

export function getImageURL(type, originalUrl) {
    let retURL = originalUrl;
    let regexExp = '';
    for (let i = 0; i < IMAGE_SIZES.length; i++) {
        regexExp = new RegExp(IMAGE_SIZES[i], 'g');
        retURL = retURL.replace(regexExp, IMAGE_TYPE_MAPPING[type]);
    }
    return retURL;
}

export const generateHufferUrl = (imageURL, options = {}) => {
    let changeStr = '';
    for (let key in options) {
        changeStr += `${HUFFER_TYPES[key]}:${options[key]},`;
    }
    //transformed struct. for resize only currently
    changeStr = 'resize-' + changeStr;

    let retUrl = imageURL;
    for (let i = 0; i < HUFFER_IMAGE_SIZES.length; i++) {
        let regexExp = new RegExp(HUFFER_IMAGE_SIZES[i], 'g');
        retUrl = imageURL.replace(regexExp, changeStr);
    }
    return retUrl;
};

export const toListingThumbnail = (imageURL) => {
    // return imageURL.replace('original', '60x60')
    return imageURL;
};
