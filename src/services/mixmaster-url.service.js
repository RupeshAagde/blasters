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
    PUBLIC_EXTENSIONS: () => {
        return urlJoin(MIXMASTER_ADMIN_BASE, `/v1.0/extensions`);
    },
    CHECK_DUPLICATE_SLUG: (slug) => {
        return urlJoin(
            MIXMASTER_ADMIN_BASE,
            `/v1.0/collection/check-slug/${slug}`
        );
    },
    EXTENSION_CATEGORIES_ADMIN: (organization_id) => {
        return urlJoin(MIXMASTER_ADMIN_BASE + `/v1.0/extension/category/all`);
    },
    FETCH_PARTNER_ORGANIZATIONS: () => {
        return urlJoin(MIXMASTER_ADMIN_BASE, `/v1.0/organization/`);
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
};

export default URLS;
