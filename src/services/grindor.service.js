import ApiService from './api.service';
import URLS from './domain.service';

import { getCommonHeaderOptions } from './utils.service';
import _ from 'lodash';
import axios from 'axios';

import root from 'window-or-global';
const env = root.env || {};
const config = root.config || {};

const GrindorService = {
    hdns: [env.CDN_ITEM_DOMAINS],
    isHDNPath(path) {
        const url = new URL(path);
        return this.hdns.includes(url.hostname);
    },
    getPublicUrl(companyId, data = {}) {
        let axiosOption = Object.assign(
            {},
            {
                data
            },
            getCommonHeaderOptions()
        );
        return ApiService.post(URLS.GET_PUBLIC_URL(), axiosOption);
    },
    uploadToGrindorStart(namespace, body) {
        let axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );
        return ApiService.post(
            URLS.GRINDOR_UPLOAD_START(namespace),
            axiosOption
        );
    },
    uploadToGrindorS3(url, file) {
        return axios.put(url, file, {
            withCredentials: false,
            headers: { 'Content-Type': file.type }
        });
    },

    uploadToGrindorComplete(namespace, body) {
        let axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );
        return ApiService.post(
            URLS.GRINDOR_UPLOAD_COMPLETE(namespace),
            axiosOption
        );
    },
    getProxyURL() {
        return URLS.GRINDOR_PROXY();
    },
    proxy(data) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(), {
            data
        });
        return ApiService.post(URLS.GRINDOR_PROXY(), axiosOption);
    },
    explore(namespace, params) {
        let axiosOption = Object.assign({}, getCommonHeaderOptions(), {
            params
        });
        return ApiService.get(URLS.GRINDOR_EXPLORER(namespace), axiosOption);
    },
    upload(namespace, body, file) {
        let response = null;
        let axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );

        return ApiService.post(
            URLS.GRINDOR_UPLOAD_START(namespace),
            axiosOption
        )
            .then(({ data }) => {
                response = data;
                let S3URL =
                    data.upload && data.upload.url ? data.upload.url : '';
                if (S3URL) {
                    return this.uploadToGrindorS3(S3URL, file);
                } else {
                    throw { message: 'Failed to upload file' };
                }
            })
            .then((res) => {
                if (res.status == 200) {
                    return this.uploadToGrindorComplete(namespace, response);
                } else {
                    throw { message: 'Failed to upload file' };
                }
            })
            .catch((err) => {
                console.error(err);
                throw err;
            });
    },
    copyUrlToGrindor(body) {
        let axiosOption = Object.assign({}, { data: body });
        return ApiService.post(URLS.GRINDOR_COPY_FILE(), axiosOption);
    },
    // namespace and display name mapping, keep it in alphabetical order to easy to find
    namespaceToDisplayNameMapping: {
        'application-favicon-logo': 'Favicon Logo',
        'application-free-logo': 'Application Logo',
        'application-landscape-banner': 'Application Banner',
        'application-theme-images': 'Theme Images',
        'auth-desktop-image': 'Desktop Auth Images',
        'auth-mobile-image': 'Mobile Auth Images',
        'autocomplete-search-logo': 'Autocomplete Search',
        'blog-featured-image': 'Blog Images',
        'blog-image': 'Blog Images',
        'brand-landscape-banner': 'Brand Banners',
        'brand-portrait-banner': 'Brand Banners',
        'brand-square-logo': 'Brand Logo',
        'business-highlights-logo': 'Business Highlights',
        'category-landscape-banner': 'Category Banners',
        'category-portrait-banner': 'Category Banners',
        'collection-landscape-banner': 'Collection Banners',
        'collection-portrait-banner': 'Collection Banners',
        'collection-square-logo': 'Collection Logo',
        'faq-square-logo': 'FAQ Images',
        icon: '',
        'mobile-build-landing': 'Landing Images',
        'mobile-build-splash': 'Splash Images',
        'page-image': 'Page Images',
        'products-item-image': 'Product Images',
        'products-item-video': 'Product Videoes',
        'rewards-landscape-banner': 'Reward Banners',
        'screensaver-banner': 'Screensaver Banners'
    },
    getDisplayName(namespace) {
        const displayName = this.namespaceToDisplayNameMapping[namespace];
        if (displayName) {
            return displayName;
        } else {
            return 'Images';
        }
    }
};

export default GrindorService;
