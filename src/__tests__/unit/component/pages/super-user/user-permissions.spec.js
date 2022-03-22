import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import UserPermissions from '@/pages/super-user/user-permissions.vue';
import URLS from '@/services/domain.service.js';
import MM_URLS from '@/services/mixmaster-url.service.js';
import flushPromises from 'flush-promises';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { 
    access_res, acl_res, company_list_res, 
    user_list_res, partners_list_res,
    partners_list_search_res
} from './mocks';
import { Promise } from 'window-or-global';

describe('User Permission Component', () => {
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
        mock.onGet(MM_URLS.FETCH_PARTNER_ORGANIZATIONS()).reply(200, partners_list_res);
        mock.onGet(
            MM_URLS.FETCH_PARTNER_ORGANIZATIONS(),
            { query: { page_no: 1, page_size: 10, q: { name: 'Demo' } }}
        ).reply(200, partners_list_search_res);
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

    it('will update the partners list in the component', async() => {
        await flushPromises();

        let radioButton = wrapper.findAll('.partner-radio').at(1);
        radioButton.vm.$emit('input', 'specific');

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        let dropdown = wrapper.find('.partners-dropdown');
        
        dropdown.vm.$emit('input', ['610d178e2ab8f356aa98481b']);

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.userData.partner_access.organization.length).not.toBe(0);
    });

    it('will search the partners', async() => {
        await flushPromises();

        let radioButton = wrapper.findAll('.partner-radio').at(1);
        radioButton.vm.$emit('input', 'specific');

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        let dropdown = wrapper.find('.partners-dropdown');

        dropdown.vm.$emit('searchInputChange', {text: 'Demo'});

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        await new Promise(resolve => setTimeout(resolve, 610));

        expect(wrapper.vm.partners.length).not.toBe(0);
    });

    it('will remove the partner selected by the user', async() => {
        await flushPromises();

        wrapper.setData({
            selectedPartners: [
                '6110d82395dcfa2a7a408ce2',
                '611a6ebd16b8c9f0bc1b7c1e'
            ]
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        let chip = wrapper.findAll('.partner-chip-remove').at(1);
        chip.vm.$emit('click');

        expect(wrapper.vm.selectedPartners.length).toBe(1);
    });

    it('will select the radio button "Specific" based on data received', async() => {
        await flushPromises();

        wrapper = shallowMount(UserPermissions, {
            localVue,
            propsData: {
                user_data: {
                    ...user_list_res.docs[0],
                    partner_access: {
                        all: false,
                        organization: [
                            {
                                _id: "6110d82395dcfa2a7a408ce2",
                                name: "Demo",
                                details: "Demp",
                                slug: "Demo-za4-21"
                            }
                        ]
                    }
                },
                selected_company: []
            }
        });

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.partnerData.currentAccess).toBe('specific');
    });
    
    it('will select the radio button "None" based on data received', async() => {
        await flushPromises();
        
        wrapper = shallowMount(UserPermissions, {
            localVue,
            propsData: {
                user_data: {
                    ...user_list_res.docs[0],
                    partner_access: {
                        all: false,
                        organization: []
                    }
                },
                selected_company: []
            }
        });

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.partnerData.currentAccess).toBe('none');
    });

    it('should remove all the partners if user selects the "All" radio button', async() => {
        await flushPromises();

        let radioButton = wrapper.findAll('.partner-radio').at(0);
        radioButton.vm.$emit('input', 'all');

        expect(wrapper.vm.userData.partner_access.organization.length).toBe(0);
    });

    it('will remove the partner selected by the user', async() => {
        await flushPromises();

        wrapper.setData({
            partnerData: {
                partners: [
                    '6110d82395dcfa2a7a408ce2',
                    '611a6ebd16b8c9f0bc1b7c1e'
                ]
            } 
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        let radioButton = wrapper.findAll('.partner-radio').at(1);
        radioButton.vm.$emit('input', 'specific');

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        let dropdown = wrapper.find('.partners-dropdown');
        
        dropdown.vm.$emit('input', ['610d178e2ab8f356aa98481b']);

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.userData.partner_access.organization.length).not.toBe(2);
    });
});
