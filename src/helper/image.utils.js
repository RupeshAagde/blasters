export const ORIGINAL = 'ORIGINAL';

const IMAGE_SOURCE_TYPES = {
    HUFFER: 'huffer',
    CLOUDINARY: 'cloudinary'
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

const CLOUDINARY_TYPES = {
    fetch_format: 'f',
    crop: 'c',
    effect: 'e',
    flags: 'fl',
    gravity: 'g',
    height: 'h',
    radius: 'r',
    quality: 'q',
    width: 'w',
    dpr: 'dpr'
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

export function getImageTransformedURL(imageURL, options) {
    if (imageURL) {
        let baseImageType = getBaseImageSourceType(imageURL);
        switch (baseImageType) {
            case IMAGE_SOURCE_TYPES.HUFFER: {
                return generateHufferUrl(imageURL, options);
            }
            case IMAGE_SOURCE_TYPES.CLOUDINARY: {
                let arrImageURL = imageURL.split('/');
                let cdOptions = Object.assign(
                    {},
                    { cloud_name: arrImageURL[3], secure: true },
                    options
                );

                return generateCloudinaryUrl(imageURL, cdOptions);
            }
        }
    }
    return imageURL;
}

const getBaseImageSourceType = (imageURL) => {
    let hostName = new URL(imageURL).hostname;
    if (hostName === 'res.cloudinary.com') {
        return IMAGE_SOURCE_TYPES.CLOUDINARY;
    }
    return IMAGE_SOURCE_TYPES.HUFFER;
};

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

const generateCloudinaryUrl = (imageURL, options = {}) => {
    if (!options.cloud_name) return '';

    const spliter = [options.cloud_name, 'image', 'upload/'].join('/');
    const arrURL = imageURL.split(spliter);

    const keys = Object.keys(options);
    const urlParams =
        keys
            .map((key) => {
                const prefix = CLOUDINARY_TYPES[key];
                const value = options[key];
                if (prefix) {
                    return `${prefix}_${value}`;
                }
            })
            .filter(Boolean)
            .join(',') + '/';

    const url = [arrURL[0], spliter, urlParams, arrURL[1]]
        .filter(Boolean)
        .join('');

    return url;
};
export function getCloudinaryURL(imageURL, options) {
    let arrImageURL = imageURL.split('/');
    let cdOptions = Object.assign(
        {},
        { cloud_name: arrImageURL[3], secure: true },
        options
    );

    return generateCloudinaryUrl(imageURL, cdOptions);
}
export const toListingThumbnail = (imageURL) => {
    // return imageURL.replace('original', '60x60')
    return imageURL;
};
