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
	it('should update showerror property to false when value and showerror are truthy', () => {
		// Arrange
		const fieldLabel = 'name';
		const fieldObj = {
		  value: 'Some value',
		  showerror: true
		};
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
		wrapper.setData({ [fieldLabel]: fieldObj });
		// Act
		wrapper.vm.handleError(fieldLabel);
		// Assert
		expect(wrapper.vm[fieldLabel].showerror).toBe(false);
	  });
	
	  it('should not update showerror property when value is falsy', () => {
		// Arrange
		const fieldLabel = 'name';
		const fieldObj = {
		  value: '',
		  showerror: true
		};
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
		wrapper.setData({ [fieldLabel]: fieldObj });
		// Act
		wrapper.vm.handleError(fieldLabel);
		// Assert
		expect(wrapper.vm[fieldLabel].showerror).toBe(true);
	  });
	
	  it('should not update showerror property when showerror is falsy', () => {
		// Arrange
		const fieldLabel = 'name';
		const fieldObj = {
		  value: 'Some value',
		  showerror: false
		};
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
		wrapper.setData({ [fieldLabel]: fieldObj });
		// Act
		wrapper.vm.handleError(fieldLabel);
		// Assert
		expect(wrapper.vm[fieldLabel].showerror).toBe(false);
	  });
	  it('should update logo.value and set logo.showerror to false when $event is truthy and logo.showerror is true', () => {
		// Arrange
		const $event = 'path/to/image.jpg';
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
		wrapper.setData({
		  logo: {
			value: '',
			showerror: true
		  }
		});
	
		// Act
		wrapper.vm.saveImage($event);
	
		// Assert
		expect(wrapper.vm.logo.value).toBe($event);
		expect(wrapper.vm.logo.showerror).toBe(false);
	  });
	
	  it('should update logo.value without changing logo.showerror when $event is truthy and logo.showerror is false', () => {
		// Arrange
		const $event = 'path/to/image.jpg';
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
		wrapper.setData({
		  logo: {
			value: '',
			showerror: false
		  }
		});
	
		// Act
		wrapper.vm.saveImage($event);
	
		// Assert
		expect(wrapper.vm.logo.value).toBe($event);
		expect(wrapper.vm.logo.showerror).toBe(false);
	  });
	
	  it('should not update logo.value or logo.showerror when $event is falsy', () => {
		// Arrange
		const $event = '';
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
		wrapper.setData({
		  logo: {
			value: 'path/to/image.jpg',
			showerror: true
		  }
		});
	
		// Act
		wrapper.vm.saveImage($event);
	
		// Assert
		expect(wrapper.vm.logo.value).toBe('');
		expect(wrapper.vm.logo.showerror).toBe(true);
	  });
})
