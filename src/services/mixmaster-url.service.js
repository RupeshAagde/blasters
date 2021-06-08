import urlJoin from 'url-join';
import { isBrowser, isNode } from 'browser-or-node';
import root from 'window-or-global';

const envVars = root.env || {};

if (root && root.process && root.process.env && root.process.env.NODE_ENV == 'test') {
    envVars['BROWSER_CONFIG'] = root.process.env;
}

let MIXMASTER_ADMIN_BASE = isNode ?
    envVars.BROWSER_CONFIG.MIXMASTER_ADMIN_URL :
    envVars.MIXMASTER_ADMIN_URL;

const URLS = {
    EXTENSION_REVIEW: (review_id='') => {
        return urlJoin(MIXMASTER_ADMIN_BASE, `/v1.0/extension/review/${review_id}`);
    }
};

export default URLS;