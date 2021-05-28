import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import AddUserPage from '@/pages/super-user/add-user.vue';
import Billing from '@/pages/company-admin/billing.vue';
import URLS from '@/services/domain.service.js';

import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import mocks from './mocks';
import { Promise } from 'window-or-global';

describe('Load billing', () => {
    let wrapper;
    let localVue;
    const mock = new MockAdapter(axios);
    
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);        
    });
    
    afterEach(() => {
        mock.reset();
    });
    
    test('Load invoice', async () => {
        const router = new VueRouter({
			routes: [
				{ path: '/administrator/subscription/invoices/:billingNo', component: Billing }
			]
		});
		router.push('/administrator/subscription/invoices/605ccdc6e35be300338e41c1');
        mock.onGet(URLS.FETCH_INVOICE_DETAILS("605ccdc6e35be300338e41c1")).reply(200, mocks.billing);
        wrapper = shallowMount(Billing, {
            localVue,
            router
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
});
