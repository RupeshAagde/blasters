'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import UpdateMarketplace from "./../../../../../../pages/settings/onboarding/update-marketplace.vue";
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import MOCK_DATA from '../fixtures/onboarding/update-marketplace.json';
import URLS from "../../../../../../services/domain.service"
import { Promise } from 'window-or-global';


let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Mounted UpdateMarketplace Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({routes : [
            {
            path: '/administrator/settings/marketplace/list',
            component: UpdateMarketplace
            }
        ]
        });
        router.push('/administrator/settings/marketplace/edit/000000000000000000000001');
    });
	
	it('Get existing marketplace Details Success', async () => {
		mock.onGet(URLS.INTERNAL_MARKETPLACES_ADMIN_SERVICE('000000000000000000000001')).reply(
            200,
            MOCK_DATA
        );
        wrapper = mount(UpdateMarketplace, {
            localVue,
            router
		});
		await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.pageError).toBe(false);
        expect(wrapper.vm.pageLoading).toBe(false);
        expect(wrapper.vm.lineItems.length).toBe(5);
        mock.reset();
	});
});

