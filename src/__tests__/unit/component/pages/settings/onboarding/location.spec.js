'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import Location from "./../../../../../../pages/settings/onboarding/location.vue";
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import MOCK_DATA from '../fixtures/onboarding/location.json';
import URLS from "../../../../../../services/domain.service"

let localVue, wrapper, router;
const mock = new MockAdapter(axios);
describe('Mounted Location Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({routes : [
            {
                path: '/administrator/settings/location',
                component: Location
            }
        ]
        });
        router.push('/administrator/settings/location');
    });
	
	it('Get Location Success', async () => {
		mock.onGet(URLS.ADMIN_PANEL_CONFIG('location')).reply(
            200,
            MOCK_DATA
        );
        wrapper = mount(Location, {
            localVue,
            router
		});
		await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.lineItems.length).toBe(1);
	});

    it('Get Location Error', async () => {
        mock.onGet(URLS.ADMIN_PANEL_CONFIG('location')).reply(500, {message: "Error"});
        wrapper = mount(Location, {
            localVue,
            router,
        })
        await flushPromises();
        expect(wrapper.vm.pageError).toBe(true);
	});


    it('Update Location Success', async () => {
		mock.onGet(URLS.ADMIN_PANEL_CONFIG('location')).reply(
            200,
            MOCK_DATA
        );
        mock.onPatch(URLS.ADMIN_PANEL_CONFIG('location'), MOCK_DATA).reply(200);
        wrapper = mount(Location, {
            localVue,
            router
		});
        // await new Promise(resolve => setTimeout(resolve, 10));
		await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.lineItems.length).toBe(1);
        
        const postBtn = wrapper.find('#save');
        expect(postBtn.exists()).toBe(true)
        postBtn.trigger('click')
	});
});