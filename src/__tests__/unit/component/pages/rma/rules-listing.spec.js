'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import URLS from '../../../../../services/domain.service';
import flushPromises from "flush-promises";
import RulesListing from '../../../../../pages/rma/rules-listing.vue';
import CustomRulesHeader from '../../../../../pages/rma/rules-components/custom-rules-header.vue';
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
const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
let localStorageMock = {};

describe('RulesListing', () => {
    beforeAll(() => {
        global.Storage.prototype.setItem = jest.fn((key, value) => {
            localStorageMock[key] = value
        });
        global.Storage.prototype.getItem = jest.fn((key) => localStorageMock[key]);
    })

    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        localStorageMock = {};
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
        .reply(200, mocks.global_rules_list);
        await flushPromises();
    })
    
    afterAll(() => {
        global.Storage.prototype.setItem.mockReset()
        global.Storage.prototype.getItem.mockReset()
    })
    
    it('is a vue instance', async() => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    it('Renders rules', async () => {
        await wrapper.vm.loadRules();
        await flushPromises();
        expect(wrapper.vm.showLoader).toBeFalsy();
        expect(wrapper.vm.tableData.length).toBeGreaterThanOrEqual(4);
    });
    it('pagination data', async() => {
        wrapper.vm.paginationChange({ limit: 2, current: 1 })
        expect(wrapper.vm.rulesParams.page_size).toBeGreaterThanOrEqual(1);
        expect(wrapper.vm.rulesParams.page_no).toBeGreaterThanOrEqual(1);
    });
    it('Updates rules params', async () => {
        wrapper.vm.updateRuleParams();
        wrapper.vm.tableData = mocks.global_rules_list.items;
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.tableHeadings.length).toBeGreaterThanOrEqual(3);
    });
    it('Checks for rule type', () => {
        wrapper.vm.showCustom = true;
        wrapper.vm.updateRuleParams();
        expect(wrapper.vm.rulesParams.rule_type).toBe('custom')
        wrapper.vm.showCustom = false;
        wrapper.vm.updateRuleParams();
        expect(wrapper.vm.rulesParams.rule_type).toBe('global')
    });
    it('Delete rule', async () => {
        let deletRuleMock = jest.spyOn(wrapper.vm, "deleteRule");
        let loadRulesMock = jest.spyOn(wrapper.vm, "loadRules");
        wrapper.find('.row-cta.delete').trigger('click');
        wrapper.find('.delete-yes').trigger('click');
        sleep(1000).then(() => {
            expect(deletRuleMock).toHaveBeenCalled();
            expect(loadRulesMock).toHaveBeenCalled();
        })
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
    it('Tests redirection', async () => {
        wrapper.vm.isGlobal = true;
        let redirectSetupFunction = jest.spyOn(wrapper.vm, "redirectToEdit");
        let redirectEditFunction = jest.spyOn(wrapper.vm, "redirectToEdit");
        let redirectToFunction = jest.spyOn(wrapper.vm, "redirectTo");
        wrapper.find('.row-cta.edit').trigger('click');
        sleep(100).then(() => {
            expect(redirectEditFunction).toHaveBeenCalled();
            expect(redirectToFunction).toHaveBeenCalledWith('edit');
        });
        wrapper.find('.jumbotron-container button').trigger('click');
        sleep(100).then(() => {
            expect(redirectSetupFunction).toHaveBeenCalled();
            expect(redirectToFunction).toHaveBeenCalledWith('setup');
        });
    })
    it('Checks Default Path', () => {
        wrapper.vm.isGlobal = true;
        sleep(100).then(() => {
            expect(wrapper.vm.defaultPath).toBe('/administrator/rma/rules/global');
        })
        wrapper.vm.isGlobal = false;
        sleep(100).then(() => {
            expect(wrapper.vm.defaultPath).toBe('/administrator/rma/rules/custom');
        })
    })
    it('Local Storage test', () => {
        const mockData = {
            dummy: 'dummy',
        }
        wrapper.vm.channelData = mockData;
        wrapper.vm.showCustom = true;
        wrapper.vm.updateLocalStorage();
        expect(global.Storage.prototype.setItem).toHaveBeenCalled();
        expect(global.Storage.prototype.getItem).toHaveBeenCalled();
        expect(localStorageMock['rma_sales_channel_data']).toBe(JSON.stringify({
            ...mockData,
            qc_config: 'custom'
        }));
    })
    it('Sets channel data', () => {
        let headerMock = jest.spyOn(wrapper.vm, "setCustomTableHeader");
        global.Storage.prototype.setItem('rma_sales_channel_data', JSON.stringify({
            dummy: 'dummy',
            qc_config: 'custom',
            name: 'Test name'
        }))
        wrapper.vm.isGlobal = false;
        wrapper.vm.showCustom = true;
        wrapper.vm.channelName = 'Test name';
        wrapper.vm.setChannelData();
        sleep(100).then(() => expect(headerMock).toHaveBeenCalled())
        expect(global.Storage.prototype.getItem).toHaveBeenCalled();
        // expect(wrapper.find('.nitrozen-switch input').value).toBe('true');
        // expect(wrapper.find('.jumbotron-title').textContent).toBe('Test name');
        expect(wrapper.find('.jumbotron-container').exists()).toBeTruthy();
        expect(wrapper.find('.jumbotron-title').text()).toContain('Global Rules');
    })
    it('Tests custom rules header', () => {
        const headerWrapper = mount(CustomRulesHeader, {
            propsData: {
                title: 'Test Title',
                desc: 'Test Description',
                btnLabel: 'Test Button'
            }
        });
        let btnClick = jest.spyOn(headerWrapper.vm, "btnClick");
        let toggleClick = jest.spyOn(headerWrapper.vm, "toggleClick");
        expect(headerWrapper.exists()).toBeTruthy();
        headerWrapper.find('.jumbotron-btns button').trigger('click');
        sleep(100).then(expect(btnClick).toHaveBeenCalled);
        headerWrapper.find('.jumbotron-btns input').trigger('change');
        sleep(100).then(expect(toggleClick).toHaveBeenCalled);
    })
})