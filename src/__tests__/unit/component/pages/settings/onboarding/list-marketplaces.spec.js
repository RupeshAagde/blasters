'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import ListMarketplace from "./../../../../../../pages/settings/onboarding/list-marketplace.vue";
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import MOCK_DATA from '../fixtures/onboarding/list-marketplaces.json';
import URLS from "../../../../../../services/domain.service"
import { Promise } from 'window-or-global';


let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Mounted ListMarketplace Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({routes : [
            {
            path: '/administrator/settings/marketplace/list',
            component: ListMarketplace
            }
        ]
        });
        router.push('/administrator/settings/marketplace/list');
    });
	
	it('Get ListMarketplace Success', async () => {
		mock.onGet(URLS.INTERNAL_MARKETPLACES_ADMIN_SERVICE('')).reply(
            200,
            MOCK_DATA
        );
        wrapper = mount(ListMarketplace, {
            localVue,
            router
		});
		await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.pageError).toBe(false);
        expect(wrapper.vm.pageLoading).toBe(false);
        expect(wrapper.vm.rawMarketplacesList.length).toBe(10);
        mock.reset();
	});

	it('Get ListMarketplace Error', async () => {
        mock.onGet(URLS.INTERNAL_MARKETPLACES_ADMIN_SERVICE('')).reply(500, {message: "Error"});
        wrapper = mount(ListMarketplace, {
            localVue,
            router,
        })
        await flushPromises();
        expect(wrapper.vm.pageError).toBe(true);
        mock.reset();
	});
});
