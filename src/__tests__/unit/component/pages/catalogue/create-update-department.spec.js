import { mount, shallowMount, createLocalVue } from "@vue/test-utils";
import DeptComponent from "../../../../../pages/catalogue/create-update-department.vue";
import URLS from "../../../../../services/domain.service.js"

import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import mocks from "./mocks";
import flushPromises from "flush-promises";

describe('Mounted Department', () => {
	let wrapper;
	let localVue;
	const mock = new MockAdapter(axios);

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(VueRouter);
		mock.reset();
	})

	afterEach( async () => {
		
	});

	test('Edit - empty department', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/product/department/edit/:deptId', component: DeptComponent }
			]
		})
		router.push('/administrator/product/department/edit/1');
		mock.onGet(URLS.DEPARTMENT()).reply(200, { data: [{}] });

		wrapper = mount(DeptComponent, {
			localVue,
			router
		}
		);
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.exists()).toBeTruthy();
		expect(wrapper.element).toMatchSnapshot();
		const div = wrapper.find('div');
		expect(div.exists()).toBe(true);
	})
	test('Edit - error response', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/product/department/edit/:deptId', component: DeptComponent }
			]
		})
		router.push('/administrator/product/department/edit/1');
		mock.onGet(URLS.DEPARTMENT()).reply(500, { error: "error" });

		wrapper = mount(DeptComponent, {
			localVue,
			router
		}
		);
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.vm.pageError).toBe(true)
	})
	it('Edit - verify functions', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/product/department/edit/:deptId', component: DeptComponent }
			]
		})
		router.push('/administrator/product/department/edit/1');
		mock.onGet(URLS.DEPARTMENT()).reply(200, { items: mocks.departments });

		wrapper = mount(DeptComponent, {
			localVue,
			router
		}
		);
		await new Promise(resolve => setTimeout(resolve, 10));
		const saveComponent = wrapper.findComponent({ ref: 'save-button' });
		saveComponent.vm.$emit('click');
		wrapper.vm.save();
		expect(wrapper.vm.pageLoading).toBe(true)
		wrapper.vm.redirectToListing()
		expect(wrapper.vm.$route.fullPath).toBe("/administrator/product/department")
		wrapper.vm.$set(wrapper.vm.synonym.value, 0, "test");
		wrapper.vm.removeSearchInput(0)
		expect(wrapper.vm.synonym.value).toEqual([])
		wrapper.vm.$set(wrapper.vm, 'synonymText', "text1,text2");
		wrapper.vm.addSearchText()
		expect(wrapper.vm.synonym.value).toEqual(["text1", "text2"])
		wrapper.vm.addSearchText()
	})

})
