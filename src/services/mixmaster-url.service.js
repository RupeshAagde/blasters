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

let MIXMASTER_ADMIN_BASE = isNode ?
    envVars.BROWSER_CONFIG.MIXMASTER_ADMIN_URL :
    envVars.MIXMASTER_ADMIN_URL;

let MIXMASTER_PNL_BASE = isNode
    ? envVars.BROWSER_CONFIG.MIXMASTER_PNL_URL
    : envVars.MIXMASTER_PNL_URL;

const URLS = {
    EXTENSION_REVIEW: (review_id = '') => {
        return urlJoin(
            MIXMASTER_ADMIN_BASE,
            `/v1.0/extension/review/${review_id}`
        );
    },
    GET_EXTENSION_COLLECTIONS: () => {
        return urlJoin(MIXMASTER_ADMIN_BASE, `/v1.0/collection`);
    },
    GET_EXTENSION_COLLECTIONS_DETAILS: (id = '') => {
        return urlJoin(
            MIXMASTER_ADMIN_BASE,
            `/v1.0/collection/${id}`
        );
    },
    SAVE_EXTENSION_COLLECTION: () => {
        return urlJoin(MIXMASTER_ADMIN_BASE, `/v1.0/collection`);
    },
    UPDATE_EXTENSION_COLLECTION: (id = '') => {
        return urlJoin(
            MIXMASTER_ADMIN_BASE,
            `/v1.0/collection/${id}`
        );
    },
    CHECK_DUPLICATE_SLUG: (slug) => {
        return urlJoin(
            MIXMASTER_ADMIN_BASE,
            `/v1.0/collection/check-slug/${slug}`
        );
    },
    FETCH_PARTNER_ORGANIZATIONS: () => {
        return urlJoin(MIXMASTER_ADMIN_BASE, `/v1.0/organization/`);
    },
    PUBLIC_EXTENSIONS: () => {
        return urlJoin(MIXMASTER_PNL_BASE, `/v1.0/extensions`);
    },
    PUBLIC_EXTENSION_CATEGORIES: () => {
        return urlJoin(MIXMASTER_PNL_BASE, `/v1.0/extensions/category/all`);
    },
    ADMIN_EXTENSION_CATEGORIES: () => {
        return urlJoin(MIXMASTER_ADMIN_BASE, `/v1.0/extension/category/all`);
    },
    // ==================================================
    // Extension
    GET_AVAILABLE_SECTIONS: () => {
        return urlJoin(MIXMASTER_ADMIN_BASE, `/v1.0/section/available`);
    },

    EXTENSION_HOME: () => {
        return urlJoin(MIXMASTER_ADMIN_BASE, `/v1.0/page/extension-home`);
    },
    FETCH_PUBLIC_EXTENSIONS: () => {
        return urlJoin(MIXMASTER_ADMIN_BASE, `/v1.0/extension`);
    },
    FETCH_COLLECTION_EXTENSIONS: (collectionId) => {
        return urlJoin(MIXMASTER_ADMIN_BASE, `/v1.0/collection/${collectionId}/items`);
    }
};

export default URLS;
