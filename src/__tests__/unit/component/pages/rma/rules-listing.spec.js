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
            URLS.RMA_RULES('', '/list')
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
    it('Updates rules params', async () => {
        wrapper.vm.updateRuleParams();
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.rules-table').exists()).toBe(true);
    });
    it('Checks for rule type', () => {
        wrapper.vm.showCustom = true;
        wrapper.vm.updateRuleParams();
        expect(wrapper.vm.rulesParams.rule_type).toBe('custom')
        wrapper.vm.showCustom = false;
        wrapper.vm.updateRuleParams();
        expect(wrapper.vm.rulesParams.rule_type).toBe('global')
    });
    it('Tests delete modal', () => {
        wrapper.find('.row-cta.delete').trigger('click');
        expect(wrapper.find('.delete-channel-dialog').exists()).toBe(true);
        wrapper.find('.delete-no').trigger('click');
        expect(wrapper.find('.delete-channel-dialog').element.style.display).toBe('none');
    });
    it('Table headings', () => {
        wrapper.vm.isGlobal = true;
        expect(wrapper.vm.tableHeadings).toStrictEqual([
            'ID',
            'Department',
            'Subcategory',
            'Quality Check',
            'Actions'
        ]);
    })
    it('Breadcrumb routes', () => {
        wrapper.vm.isGlobal = true;
        wrapper.vm.setBreadcrumbRoutes();
        expect(wrapper.vm.breadcrumbRoutes).toStrictEqual([
            {
                name: 'Return Merchandise Authorisation',
                path: '/administrator/rma/rules'
            },
            {
                name: 'Global Rules',
                path: ''
            }
        ])
        wrapper.vm.isGlobal = false;
        wrapper.vm.setBreadcrumbRoutes();
        expect(wrapper.vm.breadcrumbRoutes).toStrictEqual([
            {
                name: 'Return Merchandise Authorisation',
                path: '/administrator/rma/rules'
            },
            {
                name: 'Custom Rules',
                path: ''
            }
        ])
    })
    it('Rules listing search', () => {
        wrapper.vm.searchInput = '';
        wrapper.vm.showCustom = false;
        wrapper.vm.filterRulesList({searchById: false});
        expect(wrapper.vm.departmentIds).toStrictEqual([]);
        expect(wrapper.vm.channelIds).toStrictEqual([]);
        expect(wrapper.vm.ruleIds).toStrictEqual([]);
        expect(wrapper.vm.pagination.current).toBe(1);
    })
    // it('Tests delete modal', () => {})
    // it('Renders rules', async () => {
    //     expect(wrapper.vm.showLoader).toBe(true);
    //     await wrapper.vm.loadRules();
    //     await flushPromises();
    //     expect(wrapper.vm.showLoader).toBe(false);
    //     expect(wrapper.vm.tableData.length).toBeGreaterThanOrEqual(1);
    // });
})