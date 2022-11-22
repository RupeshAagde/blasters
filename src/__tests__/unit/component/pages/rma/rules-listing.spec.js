'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import URLS from '../../../../../services/domain.service';
import flushPromises from "flush-promises";
import RulesListing from '../../../../../pages/rma/rules-listing.vue';
import mocks from './fixtures/rules-listing-mock.json';

let localVue, wrapper, router;
const mock = new MockAdapter(axios)
const apiParams = {
    "page_no": 1,
    "page_size": 10,
    "is_active": true,
    "channel": [],
    "department": [],
    "id": [],
    "rule_type": 'global'
}

describe('RulesListing', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [{
                path: '/administrator/rma/rules/global',
                name: 'rma-global-rules',
                component: RulesListing
            }]
        });
        router.push('/administrator/rma/rules/global');
        wrapper = mount(RulesListing, {
            localVue,
            router
        });
        mock.onPost(
            URLS.RMA_RULES('', '/list'),
            apiParams
        )
        .reply(200, mocks.globalRulesList);
        await flushPromises();
    })
    
    it('is a vue instance', async() => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    it('pagination data', async() => {
        wrapper.vm.paginationChange({ limit: 2, current: 1 })
        expect(wrapper.vm.rulesParams.page_size).toBeGreaterThanOrEqual(1);
        expect(wrapper.vm.rulesParams.page_no).toBeGreaterThanOrEqual(1);
    });
    it('Updates rules params', () => {
        wrapper.vm.updateRuleParams();
    });
    it('Checks for table headings', () => {
        
    });
    it('Renders rules', async () => {
        expect(wrapper.vm.showLoader).toBe(true);
        await wrapper.vm.loadRules();
        await flushPromises();
        expect(wrapper.vm.showLoader).toBe(false);
        expect(wrapper.vm.tableData.length).toBeGreaterThanOrEqual(1);
    });
})