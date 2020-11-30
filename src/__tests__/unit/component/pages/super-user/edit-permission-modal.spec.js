import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import EditPermissionModal from '@/pages/super-user/edit-permission-modal.vue';
import URLS from '@/services/domain.service.js';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { user_list_res } from './mocks';
import { Promise } from 'window-or-global';

describe('Administrator Users', () => {
    let wrapper;
    let localVue;
    const mock = new MockAdapter(axios);
    
    const VueEditPermissionStub = {
        render: () => {}
    };

    const VueNitrozenModalStub = {
        render: () => {},
        methods: {
            open: () => {},
            close: () => {}
        }
    };

    beforeEach(() => {
        localVue = createLocalVue();
        window.scrollTo = (x, y) => {
            document.documentElement.scrollTop = y;
        };
    });
    
    afterEach(() => {
        mock.reset();
    });
    
    test('Open Edit Permission Modal', async () => {
        mock.onGet(URLS.DELETE_USERS(user_list_res.docs[0]._id)).reply(200, user_list_res.docs[0]);
        wrapper = shallowMount(EditPermissionModal, {
            localVue,
            propsData: {
                active_user: user_list_res.docs[0],
                edit_mode: true
            },
            stubs: {
                'nitrozen-dialog': VueNitrozenModalStub
            }
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);

        const openMethod = jest.spyOn(
            wrapper.vm.$refs.edit_permissions_dialog,
            'open'
        );
        wrapper.vm.open();
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(openMethod).toHaveBeenCalled();
    });

    test('Edit Permission Modal Api error', async () => {
        wrapper = shallowMount(EditPermissionModal, {
            localVue,
            propsData: {
                active_user: user_list_res.docs[0],
                edit_mode: true
            },
            stubs: {
                'nitrozen-dialog': VueNitrozenModalStub
            }
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);

        const openMethod = jest.spyOn(
            wrapper.vm.$refs.edit_permissions_dialog,
            'open'
        );
        wrapper.vm.open();
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(openMethod).toHaveBeenCalled();
    });

    test('Emit Permission data', async () => {
        mock.onGet(URLS.DELETE_USERS(user_list_res.docs[0]._id)).reply(200, user_list_res.docs[0]);
        wrapper = mount(EditPermissionModal, {
            localVue,
            propsData: {
                active_user: user_list_res.docs[0],
                edit_mode: true
            },
            stubs: {
                'user-permissions': VueEditPermissionStub
            }
        });

        expect(wrapper.exists()).toBeTruthy();
        expect(wrapper.element).toMatchSnapshot();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        wrapper.vm.open();
        await new Promise((resolve) => setTimeout(resolve, 10));
        
        wrapper.vm.close('update');
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(wrapper.emitted('close').length).toBe(1);
    });
});
