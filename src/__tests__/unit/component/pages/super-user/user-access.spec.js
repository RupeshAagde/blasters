import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
import UserAccessList from "@/pages/super-user/user-access.vue";
import URLS from "@/services/domain.service.js"

import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { access_res, acl_res, company_list_res, user_list_res } from "./mocks";
import { Promise } from "window-or-global";

describe('Administrator Users', () => {
	let wrapper;
	let localVue;
	const mock = new MockAdapter(axios);
	const VueEditPermissionsStub = {
		render: () => { },
		methods: {
			open: () => { },
			close: () => { }
		}
	}

	const VueRemoveUserStub = {
		render: () => { },
		methods: {
			open: () => { },
			close: () => { }
		}
	}

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(VueRouter);

		window.scrollTo = (x, y) => {
			document.documentElement.scrollTop = y;
		}
		mock.onGet(URLS.GET_COMPANY_LIST()).reply(200, company_list_res);
		mock.onGet(URLS.ADMIN_PERMISSIONS()).reply(200, acl_res);
		mock.onGet(URLS.VALIDATE_USER()).reply(200, access_res);
	});

	afterEach(() => {
		mock.reset();
	});
	test('List Admin Users', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/user-management', component: UserAccessList }
			]
		})
		router.push('/administrator/user-management');
		mock.onGet(URLS.LIST_USERS()).reply(200, user_list_res);

		wrapper = mount(UserAccessList, {
			localVue,
			router
		}
		);
		expect(wrapper.exists()).toBeTruthy();
		expect(wrapper.element).toMatchSnapshot();
		const div = wrapper.find('div');
		expect(div.exists()).toBe(true);
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.vm.pageLoading).toBe(false);
		expect(wrapper.vm.userList.length).toBe(10);
	});

	test('List User Pagination', async () => {

		const router = new VueRouter({
			routes: [
				{ path: '/administrator/user-management', component: UserAccessList }
			]
		})
		router.push('/administrator/user-management');
		mock.onGet(URLS.LIST_USERS()).reply(200, user_list_res);

		wrapper = mount(UserAccessList, {
			localVue,
			router
		}
		);
		expect(wrapper.exists()).toBeTruthy();

		wrapper.vm.paginationChange({ current: 2, limit: 2 }, null);
		expect(wrapper.vm.pagination.current).toBe(2);

	})

	test('Error on list users', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/user-management', component: UserAccessList }
			]
		})
		router.push('/administrator/user-management');
		mock.onGet(URLS.LIST_USERS()).reply(500, {});

		wrapper = mount(UserAccessList, {
			localVue,
			router
		}
		);
		expect(wrapper.exists()).toBeTruthy();
		expect(wrapper.element).toMatchSnapshot();
		const div = wrapper.find('div');
		expect(div.exists()).toBe(true);
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.vm.pageLoading).toBe(false);
		expect(wrapper.vm.pageError).toBe(true);
	});

	test('Add user navigation', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/user-management', component: UserAccessList }
			]
		})
		router.push('/administrator/user-management');
		mock.onGet(URLS.LIST_USERS()).reply(500, {});

		wrapper = mount(UserAccessList, {
			localVue,
			router
		}
		);
		expect(wrapper.exists()).toBeTruthy();
		expect(wrapper.element).toMatchSnapshot();
		const div = wrapper.find('div');
		expect(div.exists()).toBe(true);
		await new Promise(resolve => setTimeout(resolve, 10));
		let jumbotron = wrapper.findComponent({ name: 'jumbotron' });
		jumbotron.vm.btnClick();
		expect(router.currentRoute.path).toBe('/administrator/add-user');
	});

	test('Users Search', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/user-management', component: UserAccessList }
			]
		})
		router.push('/administrator/user-management');
		mock.onGet(URLS.LIST_USERS()).reply(200, user_list_res);
		mock.onGet(URLS.SEARCH_USER()).reply(200, [{ "_id": user_list_res.docs[0]._id }]);

		wrapper = mount(UserAccessList, {
			localVue,
			router
		}
		);
		expect(wrapper.exists()).toBeTruthy();
		expect(wrapper.element).toMatchSnapshot();
		const div = wrapper.find('div');
		expect(div.exists()).toBe(true);
		wrapper.vm.$set(wrapper.vm.$data, 'searchText', 'abc@gmail.com');
		wrapper.vm.debounceInput();
		await new Promise(resolve => setTimeout(resolve, 300));
		wrapper.vm.clearSearchFilter();
		wrapper.vm.$set(wrapper.vm.$data, 'searchText', 'invalid_email');
		wrapper.vm.debounceInput();
		await new Promise(resolve => setTimeout(resolve, 300));
		expect(wrapper.vm.userId).toBe('');

	});

	test('Users Search Fail', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/user-management', component: UserAccessList }
			]
		})
		router.push('/administrator/user-management');
		mock.onGet(URLS.LIST_USERS()).reply(200, user_list_res);
		mock.onGet(URLS.SEARCH_USER()).reply(200, []);

		wrapper = mount(UserAccessList, {
			localVue,
			router
		}
		);
		expect(wrapper.exists()).toBeTruthy();
		expect(wrapper.element).toMatchSnapshot();
		wrapper.vm.$set(wrapper.vm.$data, 'searchText', 'abc@gmail.com');
		wrapper.vm.debounceInput();
		await new Promise(resolve => setTimeout(resolve, 300));
		expect(wrapper.vm.userId).toBe(null);
		expect(wrapper.vm.pagination.total).toBe(0);
		expect(wrapper.vm.userList.length).toBe(0);
		
		wrapper.vm.clearSearchFilter();
		wrapper.vm.debounceInput();
		await new Promise(resolve => setTimeout(resolve, 300));

		mock.onGet(URLS.SEARCH_USER()).reply(500, []);
		wrapper.vm.$set(wrapper.vm.$data, 'searchText', 'abc@gmail.com');
		await new Promise(resolve => setTimeout(resolve, 300));
		expect(wrapper.vm.userId).toBe('');
	});

	test('Users Remove Dialog', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/user-management', component: UserAccessList }
			]
		})
		router.push('/administrator/user-management');
		mock.onGet(URLS.LIST_USERS()).reply(200, user_list_res);
		mock.onGet(URLS.SEARCH_USER()).reply(200, []);

		wrapper = shallowMount(UserAccessList, {
			localVue,
			router,
			stubs: {
				'nitrozen-dialog': VueRemoveUserStub,
				'edit-permissions': VueEditPermissionsStub
			}
		}
		);
		expect(wrapper.exists()).toBeTruthy();
		expect(wrapper.element).toMatchSnapshot();
		expect(wrapper.vm.activeUser).toBe(null);

		let rmDialogComp = wrapper.findComponent({ ref: 'user_remove_dialog' });
		const openMethod = jest.spyOn(rmDialogComp.vm, 'open');
		wrapper.vm.openRemoveDialog({ firstName: 'a', lastName: 'b' }, { stopPropagation: () => { } });
		const closeMethod = jest.spyOn(rmDialogComp.vm, 'close');
		expect(wrapper.vm.activeUser).toBeTruthy();
		expect(openMethod).toHaveBeenCalled();

		wrapper.vm.closeRemoveDialog();
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(closeMethod).toHaveBeenCalled();
	});


	test('Remove User', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/user-management', component: UserAccessList }
			]
		});
		router.push('/administrator/user-management');
		mock.onGet(URLS.LIST_USERS()).reply(200, user_list_res);
		mock.onDelete(URLS.DELETE_USERS(user_list_res.docs[0]._id)).reply(200, []);

		wrapper = shallowMount(UserAccessList, {
			localVue,
			router,
			computed: {
				currentUserPermission: (state) => {
					return access_res;
				}
			},
			stubs: {
				'nitrozen-dialog': VueRemoveUserStub,
				'edit-permissions': VueEditPermissionsStub
			}
		}
		);
		expect(wrapper.exists()).toBeTruthy();
		expect(wrapper.element).toMatchSnapshot();
		wrapper.vm.$set(wrapper.vm.$data, 'activeUser', user_list_res.docs[0]);
		wrapper.vm.removeUser();
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.vm.pageLoading).toBeFalsy();
	});

	test('Remove User api error', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/user-management', component: UserAccessList }
			]
		});
		router.push('/administrator/user-management');
		mock.onGet(URLS.LIST_USERS()).reply(200, user_list_res);
		mock.onDelete(URLS.DELETE_USERS(user_list_res.docs[0]._id)).reply(500, []);
		mock.onGet(URLS.LIST_USERS(user_list_res.docs[0]._id)).reply(200, user_list_res.docs[0])

		wrapper = shallowMount(UserAccessList, {
			localVue,
			router,
			computed: {
				currentUserPermission: (state) => {
					return access_res;
				}
			},
			stubs: {
				'nitrozen-dialog': VueRemoveUserStub,
				'edit-permissions': VueEditPermissionsStub
			}
		}
		);
		expect(wrapper.exists()).toBeTruthy();
		expect(wrapper.element).toMatchSnapshot();
		wrapper.vm.$set(wrapper.vm.$data, 'activeUser', user_list_res.docs[0]);
		wrapper.vm.removeUser();
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.vm.pageLoading).toBeFalsy();
	});

	test('Edit User permissions', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/user-management', component: UserAccessList }
			]
		});
		router.push('/administrator/user-management');
		mock.onGet(URLS.LIST_USERS()).reply(200, user_list_res);
		mock.onGet(URLS.LIST_USERS(user_list_res.docs[0]._id)).reply(200, user_list_res.docs[0])

		wrapper = shallowMount(UserAccessList, {
			localVue,
			router,
			computed: {
				currentUserPermission: (state) => {
					return access_res;
				}
			},
			stubs: {
				'edit-permissions': VueEditPermissionsStub
			}
		}
		);
		expect(wrapper.exists()).toBeTruthy();
		expect(wrapper.element).toMatchSnapshot();
		wrapper.vm.editUserPermissions(user_list_res.docs[0]);
		await new Promise(resolve => setTimeout(resolve, 10));
		let editDialogComp = wrapper.findComponent({ ref: 'edit-permission' });
		expect(wrapper.vm.activeUser).toBeTruthy();
		expect(editDialogComp.exists()).toBeTruthy();
	});

	test('Update User permissions', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/user-management', component: UserAccessList }
			]
		});
		router.push('/administrator/user-management');
		mock.onGet(URLS.LIST_USERS()).reply(200, user_list_res);
		mock.onGet(URLS.LIST_USERS(user_list_res.docs[0]._id)).reply(200, user_list_res.docs[0])
		mock.onPut(URLS.DELETE_USERS(user_list_res.docs[0]._id)).reply(200, user_list_res.docs[0])

		wrapper = shallowMount(UserAccessList, {
			localVue,
			router,
			computed: {
				currentUserPermission: (state) => {
					return access_res;
				}
			}
		}
		);
		expect(wrapper.exists()).toBeTruthy();
		expect(wrapper.element).toMatchSnapshot();
		wrapper.vm.$set(wrapper.vm.$data, 'activeUser', user_list_res.docs[0]);
		wrapper.vm.closePermissions('Update', user_list_res.docs[0]);
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.vm.activeUser).toBeFalsy();
	});

	test('Update User permissions failed', async () => {
		const router = new VueRouter({
			routes: [
				{ path: '/administrator/user-management', component: UserAccessList }
			]
		});
		router.push('/administrator/user-management');
		mock.onGet(URLS.LIST_USERS()).reply(200, user_list_res);
		mock.onGet(URLS.LIST_USERS(user_list_res.docs[0]._id)).reply(200, user_list_res.docs[0])
		mock.onPut(URLS.DELETE_USERS(user_list_res.docs[0]._id)).reply(400, user_list_res.docs[0])

		wrapper = shallowMount(UserAccessList, {
			localVue,
			router,
			computed: {
				currentUserPermission: (state) => {
					return access_res;
				}
			}
		}
		);
		expect(wrapper.exists()).toBeTruthy();
		expect(wrapper.element).toMatchSnapshot();
		wrapper.vm.$set(wrapper.vm.$data, 'activeUser', user_list_res.docs[0]);
		wrapper.vm.closePermissions('Update', user_list_res.docs[0]);
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(wrapper.vm.activeUser).toBeFalsy();
	});
})
