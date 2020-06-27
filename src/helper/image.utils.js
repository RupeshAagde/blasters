const IMAGE_SIZES = ['270x0', '540x0', '720x0'];
export const ORIGINAL = 'ORIGINAL';

const IMAGE_TYPE_MAPPING = {
  [ORIGINAL]: 'original'
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

export function getCloudinaryURL(imageURL, options) {
  let arrImageURL = imageURL.split('/');
  let cdOptions = Object.assign(
    {},
    { cloud_name: arrImageURL[3], secure: true },
    options
  );

  return generateCloudinaryUrl(imageURL, cdOptions);
}

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

export const toListingThumbnail = (imageURL) => {
  // return imageURL.replace('original', '60x60')
  return imageURL;
};
