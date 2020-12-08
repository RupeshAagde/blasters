import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import AddUserPage from '@/pages/super-user/add-user.vue';
import URLS from '@/services/domain.service.js';

import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { access_res, acl_res, user_list_res } from './mocks';
import { Promise } from 'window-or-global';

describe('Add New Administrator User', () => {
    let wrapper;
    let localVue;
    const mock = new MockAdapter(axios);
    

    const VueEditPermissionStub = {
        render: () => {},
        methods: {
            open: () => {},
            close: () => {}
        }
    };

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);

        mock.onGet(URLS.ADMIN_PERMISSIONS()).reply(200, acl_res);
		mock.onGet(URLS.VALIDATE_USER()).reply(200, access_res);
    });
    
    afterEach(() => {
        mock.reset();
    });
    
    test('Add User page render', async () => {
        const router = new VueRouter({
			routes: [
				{ path: '/administrator/add-user', component: AddUserPage }
			]
		})
		router.push('/administrator/add-user');
        mock.onGet(URLS.DELETE_USERS(user_list_res.docs[0]._id)).reply(200, user_list_res.docs[0]);
        wrapper = shallowMount(AddUserPage, {
            localVue,
            router,
            stubs: {
                'edit-permissions': VueEditPermissionStub
            }
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        wrapper.vm.redirectToListing();
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.$router.currentRoute.path).toBe('/administrator/user-management');

        let profilePic = wrapper.vm.getUserProfile(user_list_res.docs[0]);
        expect(profilePic).toBe(user_list_res.docs[0].profile_pic);
    });

    test('Fetch registered users', async () => {
        const router = new VueRouter({
			routes: [
				{ path: '/administrator/add-user', component: AddUserPage }
			]
		})
		router.push('/administrator/add-user');
        mock.onGet(URLS.LIST_USERS()).reply(200, user_list_res);
        wrapper = shallowMount(AddUserPage, {
            localVue,
            router,
            stubs: {
                'edit-permissions': VueEditPermissionStub
            }
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        await wrapper.vm.fetchUsers();
        expect(wrapper.vm.registeredUserList.length).toBe(10);

        mock.onGet(URLS.LIST_USERS()).reply(400, user_list_res);
        await wrapper.vm.fetchUsers();
    });

    test('Add user dialog', async () => {
        const router = new VueRouter({
			routes: [
				{ path: '/administrator/add-user', component: AddUserPage }
			]
		})
		router.push('/administrator/add-user');
        mock.onGet(URLS.LIST_USERS()).reply(200, user_list_res);
        wrapper = shallowMount(AddUserPage, {
            localVue,
            router,
            stubs: {
                'edit-permissions': VueEditPermissionStub
            }
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        
        wrapper.vm.$set(wrapper.vm.$data, 'activeUser', {});
        await new Promise(resolve => setTimeout(resolve, 10));
        let addDialogComp = wrapper.findComponent({ ref: 'edit-permission' });
        const openMethod = jest.spyOn(addDialogComp.vm, 'open');
        
        wrapper.vm.openAddDialog(user_list_res.docs[0]);
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(openMethod).toHaveBeenCalled();
    });
    
    test('Add user api', async () => {
        const router = new VueRouter({
			routes: [
				{ path: '/administrator/add-user', component: AddUserPage }
			]
		})
		router.push('/administrator/add-user');
        wrapper = shallowMount(AddUserPage, {
            localVue,
            router,
            stubs: {
                'edit-permissions': VueEditPermissionStub
            }
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        
        // check api error case 
        await wrapper.vm.addUser('Add', {});

        mock.onPost(URLS.LIST_USERS()).reply(200, user_list_res);
        await wrapper.vm.addUser('Add', {});
        expect(wrapper.vm.$router.currentRoute.path).toBe('/administrator/user-management');

    });

    test('Check User Name', async () => {
        const router = new VueRouter({
			routes: [
				{ path: '/administrator/add-user', component: AddUserPage }
			]
		})
		router.push('/administrator/add-user');
        wrapper = shallowMount(AddUserPage, {
            localVue,
            router,
            stubs: {
                'edit-permissions': VueEditPermissionStub
            }
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
         
        wrapper.vm.$set(wrapper.vm.$data, 'activeUser', {firstName: 'test', lastName: 'name'});
        expect(wrapper.vm.getFullName()).toBe('test name');
    });

    test('Check User Exists', async () => {
        const router = new VueRouter({
			routes: [
				{ path: '/administrator/add-user', component: AddUserPage }
			]
		})
		router.push('/administrator/add-user');
        wrapper = shallowMount(AddUserPage, {
            localVue,
            router,
            stubs: {
                'edit-permissions': VueEditPermissionStub
            }
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        
        let lastUser = user_list_res.docs[user_list_res.docs.length - 1]; 
        wrapper.vm.$set(wrapper.vm.$data, 'userList', [lastUser]);

        // check api error
        await wrapper.vm.checkExist();
        
        let filterList = user_list_res.docs.filter(({_id})=>_id!= lastUser._id);
        mock.onGet(URLS.LIST_USERS()).reply(200, {docs: filterList});
        await wrapper.vm.checkExist();
        expect(wrapper.vm.registeredUserList.length).toBe(9);

        mock.onGet(URLS.LIST_USERS()).reply(200, user_list_res);
        await wrapper.vm.checkExist();
        expect(wrapper.vm.registeredUserList.length).toBe(10);

    });

    test('Check Search User', async () => {
        const router = new VueRouter({
			routes: [
				{ path: '/administrator/add-user', component: AddUserPage }
			]
		})
		router.push('/administrator/add-user');
        wrapper = shallowMount(AddUserPage, {
            localVue,
            router,
            stubs: {
                'edit-permissions': VueEditPermissionStub
            }
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);

        mock.onGet(URLS.SEARCH_USER()).reply(200, [{ "_id": user_list_res.docs[0]._id }]);

        wrapper.vm.$set(wrapper.vm.$data, 'searchText', '8488446622');
        wrapper.vm.searchUser();
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.userList.length).toBe(1);
        expect(wrapper.vm.noUserFound).toBe(false);
        
        wrapper.vm.$set(wrapper.vm.$data, 'searchText', 'test@gmail.com');
        wrapper.vm.searchUser();
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.userList.length).toBe(1);
        expect(wrapper.vm.noUserFound).toBe(false);

        // User not found
        mock.onGet(URLS.SEARCH_USER()).reply(200, []);
        
        wrapper.vm.$set(wrapper.vm.$data, 'searchText', '8488446622');
        wrapper.vm.searchUser();
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.noUserFound).toBe(true);

        wrapper.vm.$set(wrapper.vm.$data, 'searchText', 'test@gmail.com');
        wrapper.vm.searchUser();
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.noUserFound).toBe(true);

        // User search api fail
        mock.onGet(URLS.SEARCH_USER()).reply(400, []);

        wrapper.vm.$set(wrapper.vm.$data, 'searchText', '8488446622');
        wrapper.vm.searchUser();
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.noUserFound).toBe(true);
        expect(wrapper.vm.enterValidText).toBe(false);

        wrapper.vm.$set(wrapper.vm.$data, 'searchText', 'test@gmail.com');
        wrapper.vm.searchUser();
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.noUserFound).toBe(true);
        expect(wrapper.vm.enterValidText).toBe(false);
        

        // Invalid inputs
        wrapper.vm.$set(wrapper.vm.$data, 'searchText', 'test_input');
        wrapper.vm.searchUser();
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.enterValidText).toBe(true);


        wrapper.vm.$set(wrapper.vm.$data, 'searchText', '');
        wrapper.vm.searchUser();
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm.enterValidText).toBe(true);

    });

});
