import { mount, createLocalVue } from "@vue/test-utils";
import VariantComponent from "../../../../../pages/catalogue/create-update-variant.vue";
import URLS from "../../../../../services/domain.service.js"

import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import mocks from "./mocks";

describe('Mounted Variant Create/Update', () => {
	let wrapper;
	let localVue;
	const mock = new MockAdapter(axios);

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(VueRouter);
		mock.reset();
	})
	test('Edit - empty department', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/product/variants/edit/:uid', component: VariantComponent }
			]
		})
		router.push('/administrator/product/variants/edit/2');
		mock.onGet(URLS.DEPARTMENT()).reply(200, { data: mocks.departments });
		mock.onGet(URLS.GET_CHOICE_TYPES(), { params: { choice_type: 'variants' } }).reply(200, mocks.choicesResponse);
		mock.onGet(URLS.FETCH_VARIANT(), { params: { uid: '2' } }).reply(200, { data: mocks.variants });
		mock.onGet(URLS.FETCH_ATTRIBUTE(), {
			params: {
				page_no: 1, page_size: 100000, department: ['men',
					'electronics']
			}
		}).reply(200, mocks.attributeMasterResponse);

		wrapper = mount(VariantComponent, {
			localVue,
			router
		}
		);
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.exists()).toBeTruthy()
		expect(wrapper.element).toMatchSnapshot()
		const div = wrapper.find('div')
		expect(div.exists()).toBe(true)
	})
	test('Edit - apis return error', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/product/variants/edit/:uid', component: VariantComponent }
			]
		})
		router.push('/administrator/product/variants/edit/2');
		mock.onGet(URLS.FETCH_VARIANT(), { params: { uid: '2' } }).reply(500, "error");
		mock.onGet(URLS.FETCH_ATTRIBUTE(), {
			params: {
				page_no: 1, page_size: 100000, department: ['men',
					'electronics']
			}
		}).reply(500, "error");
		wrapper = mount(VariantComponent, {
			localVue,
			router
		}
		);
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.vm.pageLoading).toBe(false);
	})
	test('Edit - validate functions', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/product/variants/edit/:uid', component: VariantComponent }
			]
		})
		router.push('/administrator/product/variants/edit/2');
		mock.onGet(URLS.DEPARTMENT()).reply(200, { data: mocks.departments });
		mock.onGet(URLS.GET_CHOICE_TYPES(), { params: { choice_type: 'variants' } }).reply(200, mocks.choicesResponse);
		mock.onGet(URLS.FETCH_VARIANT(), { params: { uid: '2' } }).reply(200, { data: mocks.variants });
		mock.onGet(URLS.FETCH_ATTRIBUTE(), {
			params: {
				page_no: 1, page_size: 100000, department: ['men',
					'electronics']
			}
		}).reply(200, mocks.attributeMasterResponse);

		wrapper = mount(VariantComponent, {
			localVue,
			router
		}
		);
		await new Promise(resolve => setTimeout(resolve, 10));
		wrapper.vm.save();
		expect(wrapper.vm.deptkey.showerror).toBe(false);
		expect(wrapper.vm.department.showerror).toBe(false);
		wrapper.vm.redirectToListing();
		expect(wrapper.vm.$route.fullPath).toBe('/administrator/product/variants')
	})

	// test('Create', async () => {
	// 	const router = new VueRouter({routes: [
	// 		{ path: '/administrator/product/variants/create/', component: VariantComponent }
	// 	]})
	// 	router.push('/administrator/product/variants/create');
	// 	mock.onGet(URLS.DEPARTMENT()).reply(200, {data: mocks.departments});
	// 	mock.onGet(URLS.GET_CHOICE_TYPES(), {params: { choice_type: 'variants' }}).reply(200, mocks.choicesResponse);
	// 	mock.onGet(URLS.FETCH_ATTRIBUTE(), {params: {page_no: 1, page_size: 100000, department:['men',
	//     'electronics']}}).reply(200, mocks.attributeMasterResponse);

	// 	wrapper = mount(VariantComponent,{
	// 		localVue,
	// 		router
	// 	}
	// 	);
	// 	await new Promise(resolve => setTimeout(resolve, 10));
	// 	wrapper.vm.save();
	// 	expect(wrapper.vm.deptkey.showerror).toBe(true);
	// 	expect(wrapper.vm.department.showerror).toBe(true);
	// })
})
