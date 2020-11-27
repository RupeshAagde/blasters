'use strict'
import 'babel-polyfill'
import { createLocalVue, config } from '@vue/test-utils';
// import { getAppStore } from '@/entry-client';
import { createStore } from '@/store';

import Vuex from 'vuex';
const localVue = createLocalVue()
localVue.use(Vuex)
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
