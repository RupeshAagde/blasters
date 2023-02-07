'use strict'
import 'babel-polyfill'
import {
    createLocalVue,
    config
} from '@vue/test-utils';
// import { getAppStore } from '@/entry-client';
import {
    createStore
} from '@/store';

import Vuex from 'vuex';

import imageTransform from '@/pipes/imagetransform'
import currencyformat from '@/pipes/currencyformat';
import formatDate from '@/pipes/dateformat';
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.filter('imagetransform', imageTransform);
localVue.filter('currencyformat', currencyformat);
localVue.filter('formatDate', formatDate);
const store = createStore();
config.mocks['$goBack'] = () => {}
config.mocks['$store'] = store;

config.mocks['$snackbar'] = {
    global: {
        showSuccess: () => {},
        show: () => {},
        showError: () => {},
        showWarning: () => {},
        showInfo: () => {},
    }
};
window.loadGrimlock = Promise.resolve();
window.scrollTo = () => {};
window.open = (link, target) => {};
document.execCommand = () => {}
document.createRange = () => {
    const range = new Range();

    range.getBoundingClientRect = () => {
        return {
            x: 0,
            y: 0,
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0,
            toJSON: () => {}
        };
    };

    range.getClientRects = () => {
        return {
            item: () => null,
            length: 0,
            *[Symbol.iterator]() {}
        };
    };

    return range;
}