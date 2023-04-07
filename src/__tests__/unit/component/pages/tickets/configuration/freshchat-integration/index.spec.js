'use strict';

import axios from 'axios';
import VueRouter from 'vue-router';
import MockAdapter from 'axios-mock-adapter';
import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import index from '@/pages/tickets/configuration/freshchat-integration/index.vue';
import intergrationDetails from '@/pages/tickets/configuration/freshchat-integration/integrations-details.vue'
import ADMIN_URLS from '@/services/domain.service';
import flushPromises from "flush-promises";

let localVue;
let wrapper;
const mock = new MockAdapter(axios);
describe('Freshchat Index Page', () => {

    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();

        const router = new VueRouter({
            routes: [
                { path: '/administrator/support/configuration/freshchat-integration/index', component: index }
            ]
        })
        router.push('/administrator/support/configuration/integration/freshchat');

        wrapper = mount(index, {
            localVue,
            router
        })

        const mockData = {
                    "_id": "6412acf83cdf81e117fbdd1a",
                    "configuration": {
                        "siteId": "8271727f-8f5f-4729-895d-7040a1512d15",
                        "token": "37953ce6-78cd-40d6-9839-a25baa81d67b",
                        "host": "https://wchat.freshchat.com"
                    },
                    "entity_type": "partner",
                    "type": "freshchat",
                    "created_at": "2023-03-16T05:45:28.987Z",
                    "updated_at": "2023-03-17T05:40:08.723Z",
                    "__v": 0
        }

        let updateData = {
            "configuration": {
                "siteId": "8271727f-8f5f-4729-895d",
                "token": "37953ce6-78cd-40d6-9839-a25baa81d67b",
                "host": "https://wchat.freshchat.com"
            },
            "entity_type": "partner",
            "type": "freshchat",
        }
        mock.onGet(ADMIN_URLS.GET_CREDENTIAL('partner', 'freshchat')).reply(200, mockData);
        mock.onPut(ADMIN_URLS.UPDATE_CREDENTIAL('6412acf83cdf81e117fbdd1a')).reply(200, updateData);
        await flushPromises()
    })

    it('renders index page', () => {
        const wrapper = shallowMount(index)
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })

    it('Get Components', async () => {
        let childComponent = wrapper.findComponent(intergrationDetails)
        const setIntegration = jest.spyOn(wrapper.vm, 'setIntegration')
        childComponent.vm.$emit('integration');
        await wrapper.vm.$nextTick();
        expect(setIntegration).toHaveBeenCalled()
    })

})