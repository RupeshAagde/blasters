import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import Stores from '../../../../../pages/company-admin/stores.vue';
import URLS from '../../../../../services/domain.service.js';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import MOCK_DATA from './fixtures/cbs-mock.json';
import flushPromises from 'flush-promises';
import AdminRoutes from '@/router/administrator/index.js';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('Mounted Company Stores', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        // router = new VueRouter({
        //     AdminRoutes
        // });
		router = new VueRouter({routes : [
            {
            path: '/administrator/company-details/:companyId',
            component: Stores
            }
        ]
        });
        router.push('/administrator/company-details/1');
	});
	it('Fetch Stores successfully', async () => {
		mock.onGet(URLS.COMPANY_STORES({company_id:1})).reply(200, MOCK_DATA.stores.allStoresResMockData);
		mock.onGet(URLS.GET_CHOICE_TYPES()).reply(200, MOCK_DATA.stores.storeTypeMockData);
		wrapper = shallowMount(Stores, {
			localVue,
			router
		})
		await flushPromises();

		expect(wrapper.element).toMatchSnapshot();
		expect(wrapper.exists()).toBeTruthy();
		const div = wrapper.find('div');
		expect(div.exists()).toBe(true);
		expect(wrapper.vm.storeType.length).toBe(3);
        expect(wrapper.vm.choiceType.length).toBe(3);
		expect(wrapper.vm.storesData.length).toBe(10);
		// mock.reset();
	});

	it('Other Methods Success', async () => {
		mock.onGet(URLS.COMPANY_STORES({company_id:1})).reply(200, MOCK_DATA.stores.allStoresResMockData);
		mock.onGet(URLS.GET_CHOICE_TYPES()).reply(200, MOCK_DATA.stores.storeTypeMockData);
		wrapper = shallowMount(Stores, {
			localVue,
			router
		})
		await flushPromises();

        wrapper.vm.searchText = 'aa';
        await wrapper.vm.$nextTick(); 
        wrapper.vm.searchStores();
        await flushPromises();

        wrapper.vm.searchText = '';
        wrapper.vm.selectedChoice = 'verified';
        await wrapper.vm.$nextTick(); 
        wrapper.vm.changeStage();
        await flushPromises();

        wrapper.vm.changeStore();
        await flushPromises();

        wrapper.vm.paginationChange({current: 1,total: 0,limit: 10})
		await flushPromises();
		
		// mock.reset();
    });

	it('Fetch Stores Error', async () => {
		mock.onGet(URLS.GET_CHOICE_TYPES()).reply(200, MOCK_DATA.stores.storeTypeMockData)
		mock.onGet(URLS.COMPANY_STORES({company_id:1})).reply(500, {message: "Error"});
		
		wrapper = shallowMount(Stores, {
			localVue,
			router
		})
		await flushPromises();
		expect(wrapper.vm.pageError).toBe(true);
		// mock.reset();
	});

	

});
