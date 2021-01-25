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
    });
	
	it('Get Brand Success', async () => {
		mock.onGet(URLS.GET_COMPANY_BRANDS()).reply(
            200,
            MOCK_DATA.brands.allBrandResMockData
        );
        wrapper = mount(Brands, {
            localVue,
            router
		});
		await flushPromises();
		expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        await flushPromises();
        expect(wrapper.vm.brandsData.length).toBe(1);
        mock.reset();
	});

	it('Get Brand Error', async () => {
        mock.onGet(URLS.GET_COMPANY_BRANDS()).reply(500, {error: true});
        wrapper = mount(Brands, {
            localVue,
            router,
        })
        await flushPromises();
        expect(wrapper.vm.pageError).toBe(true);
        mock.reset();
	});
	
	it("View More Brands", async () => {
		mock.onGet(URLS.GET_COMPANY_BRANDS()).reply(
            200,
            MOCK_DATA.brands.allBrandResMockData
        );
        wrapper = mount(Brands, {
            localVue,
            router
        });
		await flushPromises();
		const btnFlag = true;
		wrapper.vm.loadMoreBrands(btnFlag);
		// const viewMoreBtn = wrapper.find('show-more-btn')
		// viewMoreBtn.trigger('click');
		const div = wrapper.find('.brands-div');
		expect(div.exists()).toBe(true);
        await flushPromises();
        mock.reset();
	});

	it("View Less Brands", async () => {
		mock.onGet(URLS.GET_COMPANY_BRANDS()).reply(
            200,
            MOCK_DATA.brands.allBrandResMockData
        );
        wrapper = mount(Brands, {
            localVue,
            router
        });
		await flushPromises();
		const btnFlag = false;
		wrapper.vm.loadMoreBrands(btnFlag);
		// const viewMoreBtn = wrapper.find('show-more-btn')
		// viewMoreBtn.trigger('click');
		const div = wrapper.find('.brands-div');
		expect(div.exists()).toBe(true);
        await flushPromises();
        mock.reset();
	});

	it("Brand Admin Dialog", async () => {
		mock.onGet(URLS.GET_COMPANY_BRANDS()).reply(
            200,
            MOCK_DATA.brands.allBrandResMockData
        );
        wrapper = mount(Brands, {
            localVue,
            router
        });
		await flushPromises();
		const item = MOCK_DATA.brands.allBrandResMockData.data[0];
		const dialogBtn = wrapper.find('.brand-img-div');
        expect(dialogBtn.exists()).toBe(true);
        mock.reset();
	});

});
