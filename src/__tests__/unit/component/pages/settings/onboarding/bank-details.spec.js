'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import BankDetail from "./../../../../../../pages/settings/onboarding/bank-details.vue";
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import MOCK_DATA from '../fixtures/onboarding/bank-details.json';
import URLS from "../../../../../../services/domain.service"
import { Promise } from 'window-or-global';


let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Mounted BankDetail Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({routes : [
            {
            path: '/administrator/settings/bank-details',
            component: BankDetail
            }
        ]
        });
        router.push('/administrator/settings/bank-details');
    });
	
	it('Get BankDetail Success', async () => {
		mock.onGet(URLS.PAYOUT_CONFIG()).reply(
            200,
            MOCK_DATA
        );
        wrapper = mount(BankDetail, {
            localVue,
            router
		});
        console.log("=route==>",wrapper.vm.$route)
        await new Promise(resolve => setTimeout(resolve, 10));
		await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.lineItems.length).toBe(2);
        mock.reset();
	});

    it('Get BankDetail Error', async () => {
        mock.onGet(URLS.PAYOUT_CONFIG()).reply(500, {message: "Error"});
        wrapper = mount(BankDetail, {
            localVue,
            router,
        })
        await flushPromises();
        expect(wrapper.vm.pageError).toBe(true);
        mock.reset();
	});

    it('Submit BankDetail Success', async () => {
		mock.onGet(URLS.PAYOUT_CONFIG()).reply(
            200,
            MOCK_DATA
        );
        
        mock.onPost(URLS.PAYOUT_CONFIG(), MOCK_DATA).reply(200);

        wrapper = mount(BankDetail, {
            localVue,
            router
		});
        console.log("=route==>",wrapper.vm.$route)
        await new Promise(resolve => setTimeout(resolve, 10));
		await flushPromises();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.lineItems.length).toBe(2);

        const postBtn = wrapper.find('#save');
        expect(postBtn.exists()).toBe(true)
        postBtn.trigger('click')
        mock.reset();
	});
});
