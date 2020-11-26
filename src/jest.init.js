import 'babel-polyfill'
import { createLocalVue, config } from '@vue/test-utils';
import Vuex from 'vuex';
const localVue = createLocalVue()
localVue.use(Vuex)
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
