'use strict';

import axios from 'axios';
import VueRouter from 'vue-router';
import MockAdapter from 'axios-mock-adapter';
import { mount, createLocalVue } from '@vue/test-utils';
import intergrationDetails from '@/pages/tickets/configuration/freshchat-integration/integrations-details.vue'

let localVue;
let wrapper;
const mock = new MockAdapter(axios);
describe('Freshchat integration details Page', () => {

    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();

        const router = new VueRouter({
            routes: [
                { path: '/administrator/support/configuration/freshchat-integration/index', component: intergrationDetails }
            ]
        })
        router.push('/administrator/support/configuration/integration/freshchat');

        wrapper = mount(intergrationDetails, {
            propsData: {
                token: '37953ce6-78cd-40d6-9839-a25baa81d67b', siteId: '8271727f-8f5f-4729-895d-7040a1512d15', host: 'https://wchat.freshchat.com', integrationsData: {
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
            },
            localVue,
            router
        })
    })

    it('renders intergrationDetails page', async () => {
        await wrapper.vm.$nextTick()
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })

    it('save method to be called', async () => {
        const save = jest.spyOn(wrapper.vm, 'save')
        wrapper.find('.integrate-btn').vm.$emit('click')
        await wrapper.vm.$nextTick();
        expect(save).toHaveBeenCalled()        
    })

    it('copyUrl method to be called', async () => {
        const copiedUrl = jest.spyOn(wrapper.vm, 'copiedUrl')
        wrapper.findComponent({ref: 'host-url-copy'}).trigger('click')
        await wrapper.vm.$nextTick();
        expect(copiedUrl).toHaveBeenCalled()        
    })

    it('copyApikey method to be called', async () => {
        const copiedApiKey = jest.spyOn(wrapper.vm, 'copiedApiKey')
        wrapper.findComponent({ref: 'api-key-copy'}).trigger('click')
        await wrapper.vm.$nextTick();
        expect(copiedApiKey).toHaveBeenCalled()        
    })

    it('copySiteIdkey method to be called', async () => {
        const copiedSiteIdKey = jest.spyOn(wrapper.vm, 'copiedSiteIdKey')
        wrapper.findComponent({ref: 'siteId-copy'}).trigger('click')
        await wrapper.vm.$nextTick();
        expect(copiedSiteIdKey).toHaveBeenCalled()
    })

})