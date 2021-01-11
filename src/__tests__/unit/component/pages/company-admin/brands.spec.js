'use strict';

import { mount, createLocalVue } from '@vue/test-utils';
import Brands from '../../../../../pages/company-admin/brands.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import MOCK_DATA from './fixtures/cbs-mock.json';
import AdminRoutes from '@/router/administrator/index.js';
import URLS from '../../../../../services/domain.service.js';
import { Promise } from 'window-or-global';
let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Mounted Brands Component', () => {
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            AdminRoutes
        });
        router.push('/administrator/company-details/1');
        mock.onGet(URLS.GET_COMPANY_BRANDS()).reply(
            200,
            MOCK_DATA.brands.allBrandResMockData
        );
        wrapper = mount(Brands, {
            localVue,
            router
        });
    });
	
	it('Get Brand Success', async () => {
		expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        // expect(wrapper.html()).toContain('View More');
        await flushPromises();
        expect(wrapper.vm.brandsData.length).toBe(1);
	});

	it('Get Brand Error', async () => {
        mock.onGet(URLS.GET_COMPANY_BRANDS()).reply(500, {error: true});
        wrapper = mount(Brands, {
            localVue,
            router,
        })
        await flushPromises();
        expect(wrapper.vm.pageError).toBe(true);
	});
	
	it("View More Brands", async () => {
		await flushPromises();
		const btnFlag = true;
		wrapper.vm.loadMoreBrands(btnFlag);
		// const viewMoreBtn = wrapper.find('show-more-btn')
		// viewMoreBtn.trigger('click');
		const div = wrapper.find('.brands-div');
		expect(div.exists()).toBe(true);
		await new Promise(resolve => setTimeout(resolve, 10));
	});

	it("View Less Brands", async () => {
		await flushPromises();
		const btnFlag = false;
		wrapper.vm.loadMoreBrands(btnFlag);
		// const viewMoreBtn = wrapper.find('show-more-btn')
		// viewMoreBtn.trigger('click');
		const div = wrapper.find('.brands-div');
		expect(div.exists()).toBe(true);
		await new Promise(resolve => setTimeout(resolve, 10));
	});

	it("Brand Admin Dialog", async () => {
		await flushPromises();
		const item = MOCK_DATA.brands.allBrandResMockData.data[0];
		wrapper.vm.openAdminDialog(item);
		const div = wrapper.find('.remove_staff_dialog')
		expect(div.exists()).toBe(true)
	});

});
