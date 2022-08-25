import Vue from 'vue';
import Vuex from 'vuex';
import { createAuthStore } from './modules/auth.module';
import { createServerStore } from './modules/server.module';
import { createCompanyStore } from './modules/company.module.js';
import { createBillingStore } from './modules/billing.module.js';
import { createPackagingStore } from './modules/packaging.module';

Vue.use(Vuex);
export function createStore() {
    const auth = createAuthStore();
    const server = createServerStore();
    const company = createCompanyStore();
    const billing = createBillingStore();
    const packaging = createPackagingStore()
    return new Vuex.Store({
        modules: {
            auth,
            server,
            company,
            billing,
            packaging
        }
    });
}
