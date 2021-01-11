'use strict'
import 'babel-polyfill'
import { createLocalVue, config } from '@vue/test-utils';
// import { getAppStore } from '@/entry-client';
import { createStore } from '@/store';

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
