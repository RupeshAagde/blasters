import urlJoin from 'url-join';
import { isBrowser, isNode } from 'browser-or-node';
import root from 'window-or-global';

const envVars = root.env || {};

if (
    root &&
    root.process &&
    root.process.env &&
    root.process.env.NODE_ENV == 'test'
) {
    envVars['BROWSER_CONFIG'] = root.process.env;
}

let MIXMASTER_ADMIN_BASE = isNode
    ? envVars.BROWSER_CONFIG.MIXMASTER_ADMIN_URL
    : envVars.MIXMASTER_ADMIN_URL;

let MIXMASTER_PARTNER_URL = isNode
    ? envVars.BROWSER_CONFIG.MIXMASTER_PARTNER_URL
    : envVars.MIXMASTER_PARTNER_URL;

const URLS = {
    EXTENSION_REVIEW: (review_id = '') => {
        return urlJoin(
            MIXMASTER_ADMIN_BASE,
            `/v1.0/extension/review/${review_id}`
        );
    },
    GET_EXTENSION_COLLECTIONS: () => {
        return urlJoin(MIXMASTER_ADMIN_BASE, `/v1.0/collection/extensions`);
    },
    GET_EXTENSION_COLLECTIONS_DETAILS: (id = '') => {
        return urlJoin(
            MIXMASTER_ADMIN_BASE,
            `/v1.0/collection/extensions/${id}`
        );
    },
    SAVE_EXTENSION_COLLECTION: () => {
        return urlJoin(MIXMASTER_ADMIN_BASE, `/v1.0/collection/extensions`);
    },
    UPDATE_EXTENSION_COLLECTION: (id = '') => {
        return urlJoin(
            MIXMASTER_ADMIN_BASE,
            `/v1.0/collection/extensions/${id}`
        );
    },
    PUBLIC_EXTENSIONS: () => {
        return urlJoin(MIXMASTER_PARTNER_URL, `/v1.0/extensions`);
    },
    CHECK_DUPLICATE_SLUG: (slug) => {
        return urlJoin(
            MIXMASTER_ADMIN_BASE,
            `/v1.0/collection/extensions/check-slug/${slug}`
        );
    },
    PUBLIC_EXTENSION_CATEGORIES: () => {
        return urlJoin(MIXMASTER_PARTNER_URL, `/v1.0/extensions/category/all`);
    },
    EXTENSION_CATEGORIES_ADMIN: (organization_id) => {
        return urlJoin(MIXMASTER_ADMIN_BASE + `/v1.0/extension/category/all`);
    },
    FETCH_PARTNER_ORGANIZATIONS: () => {
        return urlJoin(MIXMASTER_ADMIN_BASE, `/v1.0/organization/`);
    }
};

export default URLS;
