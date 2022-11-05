import Vue from 'vue';
import Vuex from 'vuex';
import { createAuthStore } from './modules/auth.module';
import { createServerStore } from './modules/server.module';
import { createCompanyStore } from './modules/company.module.js';
import { createBillingStore } from './modules/billing.module.js';
import { createPackagingStore } from './modules/packaging.module';
import { createVariantStore } from './modules/variants.module'
import {createAdminWebhookStore} from "./modules/admin-webhook.module";

Vue.use(Vuex);
export function createStore() {
    const auth = createAuthStore();
    const server = createServerStore();
    const company = createCompanyStore();
    const billing = createBillingStore();
   const variants = createVariantStore()
    const packaging = createPackagingStore();
    const webhook = createAdminWebhookStore();
    return new Vuex.Store({
        modules: {
            auth,
            server,
            company,
            billing,
            packaging,
            variants,
            webhook
        }
    });
}
