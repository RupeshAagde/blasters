import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import UserPermissions from '@/pages/super-user/user-permissions.vue';
import URLS from '@/services/domain.service.js';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { access_res, acl_res, company_list_res, user_list_res } from './mocks';
import { Promise } from 'window-or-global';

describe('Administrator Users', () => {
    let wrapper;
    let localVue;
    const mock = new MockAdapter(axios);

    beforeEach(() => {
        localVue = createLocalVue();
        window.scrollTo = (x, y) => {
            document.documentElement.scrollTop = y;
        };
        mock.onGet(URLS.GET_COMPANY_LIST()).reply(200, company_list_res);
		mock.onGet(URLS.ADMIN_PERMISSIONS()).reply(200, acl_res);
		mock.onGet(URLS.VALIDATE_USER()).reply(200, access_res);
    });
    
    afterEach(() => {
        mock.reset();
    });
    
    test('User Permissions Component', async () => {
        wrapper = mount(UserPermissions, {
            localVue,
            propsData: {
                user_data: user_list_res.docs[0],
                selected_company: []
            },
            computed: {
                aclPermissions: (state)=>{
                    return acl_res;
                }
            }
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    test('Update Selected company', async () => {
        wrapper = shallowMount(UserPermissions, {
            localVue,
            propsData: {
                user_data: user_list_res.docs[0],
                selected_company: []
            },
            computed: {
                aclPermissions: (state)=>{
                    return acl_res;
                }
            }
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        
        // test watcher
        wrapper.setProps({
            selected_company: [1]
        });
        wrapper.vm.$nextTick();

        wrapper.vm.updateSelectedCompany([1,257,348]);
        expect(wrapper.vm.userData.access.company.join(',')).toBe('1,257,348');
        await new Promise(resolve => setTimeout(resolve, 10));
        
        wrapper.vm.updateSelectedCompany([346,344,343]);
        expect(wrapper.vm.userData.access.company.join(',')).toBe('346,344,343');
        await new Promise(resolve => setTimeout(resolve, 10));
        wrapper.vm.removeChip(1);
        expect(wrapper.vm.userData.access.company.join(',')).toBe('346,343');
    });

    test('Search Company', async () => {
        wrapper = shallowMount(UserPermissions, {
            localVue,
            propsData: {
                user_data: user_list_res.docs[0],
                selected_company: []
            }
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        
        
        wrapper.vm.companySearch({text: 'sample'});
        await new Promise(resolve => setTimeout(resolve, 610));
        expect(wrapper.vm.companies.length).toBe(6);

        mock.onGet(URLS.GET_COMPANY_LIST()).reply(400, company_list_res);
        wrapper.vm.companySearch({text: 'sample'});
        await new Promise(resolve => setTimeout(resolve, 610));
    });

});
