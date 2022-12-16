import { mount, shallowMount, createLocalVue } from "@vue/test-utils";
import TemplateComponent from "../../../../../../pages/product/templates/edit.vue";
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import URLS from "../../../../../../services/domain.service.js"
import mocks from "./mocks";
import flushPromises from "flush-promises";

describe('Mounted Templates', () => {
	let wrapper;
	let localVue;
	const mock = new MockAdapter(axios);

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(VueRouter);
		mock.reset();
	});
	afterEach(async () => {
		await flushPromises();
	})
	test('Edit - is a Vue instance', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/product/templates/:slug', component: TemplateComponent }
			]
		})
		router.push('/administrator/product/templates/sunglasses-eyewear');
		mock.onGet(URLS.DEPARTMENT()).reply(200, { data: mocks.departments });
		mock.onGet(URLS.PRODUCT_TEMPLATES() + "/sunglasses-eyewear").reply(200, { data: mocks.template });
		mock.onGet(URLS.ATTRIBUTES_MASTER() + "?limit=999999&department=men&department=women&department=kids").reply
			(200, mocks.attributes).onAny().reply(200, { data: mocks.attributes });
		mock.onGet(URLS.CATEGORY() + "?page_size=999999&page_no=1&dept_id=8").reply(200, {});

		wrapper = mount(TemplateComponent, {
			localVue,
			router
		}
		);
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.exists()).toBeTruthy()
		expect(wrapper.element).toMatchSnapshot()
	})
	test('Edit - validate methods edit template', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/product/templates/:slug', component: TemplateComponent }
			]
		})
		router.push('/administrator/product/templates/sunglasses-eyewear');
		mock.onGet(URLS.DEPARTMENT()).reply(200, { items: mocks.departments });
		mock.onGet(URLS.PRODUCT_TEMPLATES() + "/sunglasses-eyewear").reply(200, { items: mocks.template });
		mock.onGet(URLS.ATTRIBUTES_MASTER() + "?limit=999999&department=men&department=women&department=kids").reply
			(200, mocks.attributes).onAny().reply(200, { data: mocks.attributes });
		mock.onGet(URLS.CATEGORY() + "?page_size=999999&page_no=1&dept_id=8").reply(200, {});

		wrapper = mount(TemplateComponent, {
			localVue,
			router
		}
		);
		await new Promise(resolve => setTimeout(resolve, 10));
		const saveButton = wrapper.findComponent({ ref: 'save-button'});
		saveButton.vm.$emit('click');
		expect(wrapper.vm.inProgress).toBe(true)
		console.log("wrapper.vm.template", wrapper.vm.template.banner)
		wrapper.vm.$set(wrapper.vm.template, 'banner_image', {})
		wrapper.vm.$set(wrapper.vm.template.banner_image, 'secure_url',
			"https://hdn-1.fynd.com/seller/pictures/landscape-banner/original/qr4Kdv_DEFAULT-BANNER_LANDSCAPE.jpg6fbfe6d1-5510-48e1-bb9f-4d517dfab129/qr4Kdv_DEFAULT-BANNER_LANDSCAPE.jpg")
		expect(wrapper.vm.isFormDirty()).toBe(true)
	})
	test('Create - is a Vue instance', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/product/templates/create', component: TemplateComponent }
			]
		})
		router.push('/administrator/product/templates/create');
		mock.onGet(URLS.DEPARTMENT()).reply(200, { data: mocks.departments });
		mock.onGet(URLS.CATEGORY() + "?page_size=999999&page_no=1&dept_id=8").reply(200, {});

		wrapper = mount(TemplateComponent, {
			localVue,
			router
		}
		);
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.exists()).toBeTruthy()
		expect(wrapper.element).toMatchSnapshot()
	})

})
