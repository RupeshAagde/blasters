'use strict';

import {
    mount,
    shallowMount,
    createLocalVue
} from '@vue/test-utils';
import OAuthClient from '@/pages/oauth-clients/oauthclient.vue';
import Client from '../../../../../pages/oauth-clients/clients/client-card.vue' 
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from "flush-promises";
import URLS from '../../../../../services/domain.service'
import CLIENTS_MOCK_DATA from './fixtures/oauth-client-list-mock.json'
import CLIENTS_COMPLETE_MOCK_DATA from './fixtures/oauth-client-list-complete-mock.json'
import Details from '../../../../../pages/oauth-clients/clients/details.vue'
import {NitrozenDialog, NitrozenButton} from '@gofynd/nitrozen-vue';

let localVue, router, wrapper;
const mock = new MockAdapter(axios);

Object.defineProperty(navigator, "clipboard", {
    value: {
       writeText: () => {},
    },
 });
 

describe('Oauth Client', () => {
    
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [{
                path: '/administrator/oauthclient',
                component: OAuthClient
            },
            {   
                name: 'edit-oauth-client',
                path: '/administrator/oauthclient/edit/:client_id',
                component: Details
            },
            {   
                name: 'create-oauth-client',
                path: '/administrator/oauthclient/create',
                permissions: ['settings'],
                component: Details
            }
            ]
        })     
        mock.onDelete(URLS.DELETE_OAUTH_CLIENT(CLIENTS_MOCK_DATA.items[0].client_id)).reply(200, CLIENTS_MOCK_DATA.items[0]);
        mock.onGet(URLS.GET_OAUTH_CLIENT_LISTING()).reply(200, CLIENTS_MOCK_DATA);
        wrapper = mount(OAuthClient, {
            localVue,
            router,
        });
        await flushPromises();

    });

    it('Listing OAuth Clients', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(wrapper.vm.oAuthClients).toStrictEqual(CLIENTS_MOCK_DATA.items);
    });

    it('Listing OAuth Clients Error', async () => {
        mock.reset();
        mock.onGet(URLS.GET_OAUTH_CLIENT_LISTING()).reply(404, 'Error');

        wrapper.vm.fetchOAuthClients();

        await flushPromises();
        expect(wrapper.vm.pageLoading).toEqual(false);
        expect(wrapper.vm.pageError).toEqual(true);

    });

    

    it('Searching OAuth Clients Pagination', async () => {
        await wrapper.setData({
            searchTxt: 'TestClient'
        })

        await wrapper.vm.$nextTick();
        
        let regex = new RegExp('TestClient', 'gi');
        let filteredResult = CLIENTS_MOCK_DATA.items.filter((item) => {
            return item.meta.name.match(regex);
        })

        wrapper.vm.paginationChange({current: 1, limit : 20}, null)
        expect(wrapper.vm.paginationConfig.current).toBe(1);
        expect(wrapper.vm.paginationConfig.limit).toBe(20);
        expect(wrapper.vm.getOAuthClients()).toEqual(filteredResult);
    });


    it('Searching OAuth Clients search debounce', async () => {
        await wrapper.setData({
            searchTxt: 'TestClient'
        })

        await wrapper.vm.$nextTick();
        
        let regex = new RegExp('TestClient', 'gi');
        let filteredResult = CLIENTS_MOCK_DATA.items.filter((item) => {
            return item.meta.name.match(regex);
        })

        wrapper.vm.debounceInput()
        expect(wrapper.vm.getOAuthClients()).toEqual(filteredResult);
        
    });

    it('Searching OAuth Clients', async () => {
        await wrapper.setData({
            searchTxt: 'TestClient'
        })

        await wrapper.vm.$nextTick();
        
        let regex = new RegExp('TestClient', 'gi');
        let filteredResult = CLIENTS_MOCK_DATA.items.filter((item) => {
            return item.meta.name.match(regex);
        })
        expect(wrapper.vm.getOAuthClients()).toEqual(filteredResult);
    });


    it('Deleting OAuth Client', async () => {
        
        const snackbarSuccess = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');

        expect(wrapper.find('.confirm_delete_client').isVisible()).toBe(false);
        wrapper.findComponent(Client).find('.delete-client').trigger('click'); 
        
        await wrapper.vm.$nextTick();

        expect(wrapper.find('.confirm_delete_client').isVisible()).toBe(true);
        wrapper.findComponent(NitrozenDialog).findComponent(NitrozenButton).trigger('click');

        await flushPromises();

        expect(snackbarSuccess).toHaveBeenCalled();



    });


    // it('Deleting OAuth Client (Error)', async () => {
        
    //     const snackbarError = jest.spyOn(wrapper.vm.$snackbar.global, 'showError');

    //     expect(wrapper.find('.confirm_delete_client').isVisible()).toBe(false);
    //     wrapper.findAllComponents(Client).at(1).find('.delete-client').trigger('click'); 
        
    //     await wrapper.vm.$nextTick();

    //     expect(wrapper.find('.confirm_delete_client').isVisible()).toBe(true);
    //     wrapper.findComponent(NitrozenDialog).findComponent(NitrozenButton).trigger('click');
        
    //     await flushPromises();

    //     expect(snackbarError).toHaveBeenCalled();   

    // });


    it('Edit OAuth Client', async () => {
    
        wrapper.findComponent(Client).find('.edit-client').trigger('click'); 
        await wrapper.vm.$nextTick();

        expect(router.currentRoute.path).toBe('/administrator/oauthclient/edit/61c8ad3f72733595e9a69ef6')
    });


    it('Copy to clipboard Client ID', async () => {
        
        document.execCommand = jest.fn();

        jest.spyOn(navigator.clipboard, "writeText");

        wrapper.findComponent(Client).find('.client-id').trigger('click'); 
        await wrapper.vm.$nextTick();

        expect(document.execCommand).toHaveBeenCalledWith("copy");
        
    });

    it('Copy to clipboard Client Secret', async () => {
        
        document.execCommand = jest.fn();

        jest.spyOn(navigator.clipboard, "writeText");

        wrapper.findComponent(Client).find('.client-secret').trigger('click'); 
        await wrapper.vm.$nextTick();
        expect(document.execCommand).toHaveBeenCalledWith("copy");
        
    });


    afterEach(()=>{
        mock.reset();
    });

})