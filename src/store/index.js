import Vue from 'vue';
import Vuex from 'vuex';
import { createAuthStore } from './modules/auth.module';
import { createServerStore } from './modules/server.module';
import { createCompanyStore } from './modules/company.module.js';

Vue.use(Vuex);
export function createStore() {
    const auth = createAuthStore();
    const server = createServerStore();
    const company = createCompanyStore();

    return new Vuex.Store({
        modules: {
            auth,
            server,
            company
        }
    });
}
