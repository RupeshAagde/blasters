import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
import PlansList from "@/pages/plan-creator/plans-list.vue";
import URLS from "@/services/domain.service.js"

import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { plan_list_res, country_list_res } from "./mocks";
import { Promise } from "window-or-global";
import { Jumbotron } from "@/components/common/";
import ListCard from "@/components/plan-creator/plan-list-card.vue";
import { NitrozenInput, NitrozenPagination } from "@gofynd/nitrozen-vue";

describe('Plans Listing', () => {
	let wrapper;
    let localVue;
    let router;
    const mock = new MockAdapter(axios);
    
    const VuePlanTypeModalStub = {
		render: () => { },
		methods: {
			open: () => { },
			close: () => { }
		}
	}

	beforeEach(async () => {
        
		localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
			routes: [
				{ path: '/administrator/subscription-plans', component: PlansList }
			]
		})
		router.push('/administrator/subscription-plans');
        mock.onGet(URLS.FETCH_PLANS_LIST()).reply(200, plan_list_res);
        mock.onGet(URLS.LOCATIONS()).reply(200, country_list_res);

		wrapper = shallowMount(PlansList, {
                localVue,
                router,
                stubs: {
                    'type-modal': VuePlanTypeModalStub
                }
            }
        );
        await new Promise(resolve => setTimeout(resolve, 10));
	});

	afterEach(() => {
		mock.reset();
    });

	test('List Subscription Plans', async () => {

		expect(wrapper.exists()).toBeTruthy();
		expect(wrapper.element).toMatchSnapshot();
		const div = wrapper.find('div');
		expect(div.exists()).toBe(true);
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.vm.loading).toBe(false);
        expect(wrapper.vm.plansList.length).toBe(9);
        // expect(wrapper.vm.countryList.length).toBe(11);
    });
    
    test('Create New Plan Modal', async () => {
		let modalOpenMethod = jest.spyOn(wrapper.vm.$refs["plan-type-modal"], "open");
		let jumbotron = wrapper.findComponent(Jumbotron);
        jumbotron.vm.$emit("btnClick");
		await wrapper.vm.$nextTick();
		expect(modalOpenMethod).toHaveBeenCalled();

		// check route navigation skipped without any type emitted
		wrapper.vm.$refs["plan-type-modal"].$emit("close");
		await wrapper.vm.$nextTick();
		expect(wrapper.vm.$router.currentRoute.path).toBe("/administrator/subscription-plans");


		wrapper.vm.$refs["plan-type-modal"].$emit("close", "test");
		await wrapper.vm.$nextTick();
		expect(wrapper.vm.$router.currentRoute.path).toBe("/administrator/subscription-plans/create");
	});

	test('Edit Plan', async () => {
		let card = wrapper.findComponent(ListCard);
		card.vm.$emit("click");
		await wrapper.vm.$nextTick();
		expect(router.currentRoute.path).toBe("/administrator/subscription-plans/edit/5f2e30cad1456d00386abf1a");
	});

	// test('Search Plans', async () => {
	// 	mock.onGet(URLS.FETCH_PLANS_LIST()).reply(function(config){
	// 		if(config.params.query === '{"name":{"$regex":"test","$options":"gi"}}') {
	// 			return [200, plan_list_res];
	// 		}
	// 		return [400, {message: 'Invalid request data'}];
	// 	});
	// 	let srchTxtBox = wrapper.findComponent(NitrozenInput);
	// 	srchTxtBox.vm.$emit("input", "test")
	// 	await new Promise(resolve => setTimeout(resolve, 600));
	// 	expect(wrapper.vm.filter_data.query.name).toBe("test");
	// 	expect(wrapper.vm.pageError).toBe(false);
	// 	expect(wrapper.vm.plansList.length).toBe(9);
	// });

	test('Page Options changes', async () => {
		mock.onGet(URLS.FETCH_PLANS_LIST()).reply(function(config){
			if(config.params.page === 2 && config.params.limit === 5 ) {
				return [200, plan_list_res];
			}
			return [400, {message: 'Invalid request data'}];
		});
		let paginationComp = wrapper.findComponent(NitrozenPagination);
		paginationComp.vm.$emit("input", {limit: 10, page: 1});
		paginationComp.vm.$emit("change");
		await wrapper.vm.$nextTick();
		expect(wrapper.vm.filter_data.pagination.limit).toBe(10);
		// expect(wrapper.vm.pageError).toBe(false);
		expect(wrapper.vm.plansList.length).toBe(9);
	});
 
	// test('Url Query Rendering', async () => {
	// 	mock.onGet(URLS.FETCH_PLANS_LIST()).reply(function(config){
	// 		if(config.params.query === '{"name":{"$regex":"test","$options":"gi"}}' && config.params.page === 1 && config.params.limit === 5 ) {
	// 			return [200, plan_list_res];
	// 		}
	// 		return [400, {message: 'Invalid request data'}];
	// 	});
		
	// 	router.push({
	// 		path: '/administrator/subscription-plans?limit=5&page=2&query=%7B"name"%3A%7B"%24regex"%3A"test","%24options"%3A"gi"%7D%7D'
	// 	}).catch(err=>{});
        
	// 	wrapper = shallowMount(PlansList, {
    //             localVue,
    //             router,
    //             stubs: {
    //                 'type-modal': VuePlanTypeModalStub
    //             }
    //         }
	// 	);
	// 	await new Promise(resolve => setTimeout(resolve, 10));
	// 	expect(wrapper.vm.filter_data.pagination.current).toBe(2);
	// 	expect(wrapper.vm.filter_data.pagination.limit).toBe(5);
	// 	expect(wrapper.vm.pageError).toBe(false);
	// 	expect(wrapper.vm.plansList.length).toBe(9);
	// });

	// test('Location Api failure', async () => {
	// 	mock.onGet(URLS.LOCATIONS()).reply(500, country_list_res);
	// 	let showErrorMethod = jest.spyOn(wrapper.vm.$snackbar.global, "showError");
	// 	wrapper = shallowMount(PlansList, {
    //             localVue,
    //             router
    //         }
	// 	);
	// 	await new Promise(resolve => setTimeout(resolve, 10));
	// 	expect(showErrorMethod).toHaveBeenCalled();

	// });

})
