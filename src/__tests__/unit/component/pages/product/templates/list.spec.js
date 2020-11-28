import { mount, createLocalVue } from "@vue/test-utils";
import ListComponent from "../../../../../../pages/product/templates/list.vue";

import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import URLS from "../../../../../../services/domain.service.js"
import mocks from "./mocks";
import { console } from "window-or-global";

describe('Mounted Templates', () => {
	let wrapper;
	let localVue;
	const mock = new MockAdapter(axios);

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(VueRouter);
		mock.reset();
		mock.onGet(URLS.SEARCH_DRI()).reply(200, [
			{
				"_id": "5f2ba5a8ffb60e372568eaaf", "gender": "female", "accountType": "user", "active": true, "phoneNumbers": [
					{ "active": true, "primary": true, "verified": true, "countryCode": 91, "phone": "9768080981" }],
				"firstName": "Mithali", "lastName": "Kamble", "emails": [{
					"active": true, "primary": true,
					"verified": true, "email": "mithalikamble@gofynd.com"
				}, {
					"active": true, "primary": false, "verified": true,
					"email": "mithalikamble@fynd.com"
				}, {
					"active": true, "primary": false, "verified": true,
					"email": "mithalikamble@uniket.store"
				}], "createdAt": "2020-08-06T06:39:36.189Z",
				"updatedAt": "2020-10-23T10:59:13.521Z", "uid": "68"
			}]);
	});
	it('List - is a Vue instance', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/product/templates/', component: ListComponent }
			]
		})
		mock.onGet(URLS.PRODUCT_TEMPLATES()).reply(200, { data: mocks.template });
		mock.onGet(URLS.DEPARTMENT()).reply(200, { data: mocks.departments });
		wrapper = mount(ListComponent, {
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
	it('List - error', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/product/templates/', component: ListComponent }
			]
		})
		mock.onGet(URLS.PRODUCT_TEMPLATES()).reply(500, "error");
		wrapper = mount(ListComponent, {
			localVue,
			router
		}
		);
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.vm.pageError).toBe(true)
	})
	it('List - verify functions', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/product/templates/', component: ListComponent }
			]
		})
		mock.onGet(URLS.PRODUCT_TEMPLATES()).reply(200, { data: mocks.template });
		mock.onGet(URLS.DEPARTMENT()).reply(200, { data: mocks.departments });
		wrapper = mount(ListComponent, {
			localVue,
			router
		}
		);
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.vm.pageError).toBe(false)
		expect(wrapper.vm.getErrorImage()).toBe('/public/admin/assets/pngs/default_icon_listing.png');
		wrapper.vm.$set(wrapper.vm, 'templates', mocks.template);
		wrapper.vm.$set(wrapper.vm, 'departmentsList', []);
		wrapper.vm.setDepartmentsList();
		wrapper.vm.setDepartmentsList({ text: 'Electronics' });
		expect(wrapper.vm.departmentsList.length).toBe(1);
		wrapper.vm.$set(wrapper.vm, 'searchText', 'elec');
		wrapper.vm.clearSearchFilter();
		expect(wrapper.vm.searchText).toBe('');

	})
	it('List - verify redirect', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/product/templates/', component: ListComponent }
			]
		})
		// mock.onGet(URLS.PRODUCT_TEMPLATES()).reply(200, {data:mocks.template});
		// mock.onGet(URLS.DEPARTMENT()).reply(200, {data:mocks.departments});
		wrapper = mount(ListComponent, {
			localVue,
			router
		}
		);
		// await new Promise(resolve => setTimeout(resolve, 10));
		wrapper.vm.redirectEdit()
		expect(wrapper.vm.$route.fullPath).toBe('/administrator/product/templates/create')
		wrapper.vm.redirectEdit("electronics");
		expect(wrapper.vm.$route.fullPath).toBe('/administrator/product/templates/electronics')
	})
})
