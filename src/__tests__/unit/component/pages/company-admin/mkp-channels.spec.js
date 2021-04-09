'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import MarketplaceChannels from '../../../../../pages/company-admin/mkp-channels.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import AdminRoutes from '@/router/administrator/index.js';
import URLS from '../../../../../services/domain.service.js';
import mocks from './mocks';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Mounted marketplace channels component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            AdminRoutes
        });
        // router.push('/administrator/company-details/1');
        mock.onGet(URLS.MARKETPLACE_WORKERS("1")).reply(
            200,
            mocks.marketplaceWorkers
        );
        wrapper = mount(MarketplaceChannels, {
            localVue,
            router,
            data() {
                return {
                  companyId: '1'
                }
              }
        });
    });
	
	it('Get marketpalce channels', async () => {
		expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        await flushPromises();
        expect(Object.keys(wrapper.vm.marketplaceWorkers).length).toBe(2);
	});
});
