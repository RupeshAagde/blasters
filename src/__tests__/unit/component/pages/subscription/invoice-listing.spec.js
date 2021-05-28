import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import AddUserPage from '@/pages/super-user/add-user.vue';
import InvoiceListing from '@/pages/company-admin/invoice-listing.vue';
import URLS from '@/services/domain.service.js';

import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import mocks from './mocks';
import { Promise } from 'window-or-global';

describe('Load invoice listing', () => {
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
    
    test('Load invoice listing page', async () => {
        const router = new VueRouter({
			routes: [
				{ path: '/administrator/subscription/invoices', component: InvoiceListing }
			]
		});
		router.push('/administrator/subscription/invoices');
        mock.onGet(URLS.FETCH_INVOICE_LISTING()).reply(200, mocks.invoicesListing);
        wrapper = shallowMount(InvoiceListing, {
            localVue,
            router
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
});
