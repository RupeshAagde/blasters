'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import URLS from '../../../../../services/domain.service';
import flushPromises from "flush-promises";
import RulesListing from '../../../../../pages/rma/rules-listing.vue';
import CustomRulesHeader from '../../../../../pages/rma/rules-components/custom-rules-header.vue';
import Breadcrumb from '../../../../../pages/rma/common/breadcrumb.vue';
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
                path: '/administrator/orders/rma/rules/global',
                name: 'rma-global-rules',
                component: RulesListing
            }]
        });
        router.push('/administrator/orders/rma/rules/global');
        wrapper = mount(RulesListing, {
            localVue,
            router
        });
        mock.onPost(
            URLS.RMA_RULES_LIST()
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
    // it('Checks for rule type', () => {
    //     wrapper.vm.showCustom = true;
    //     wrapper.vm.updateRuleParams();
    //     expect(wrapper.vm.rulesParams.rule_type).toBe('custom')
    //     wrapper.vm.showCustom = false;
    //     wrapper.vm.updateRuleParams();
    //     expect(wrapper.vm.rulesParams.rule_type).toBe('global')
    // });
    it('Delete rule', async () => {
        let deletRuleMock = jest.spyOn(wrapper.vm, "deleteRule");
        let loadRulesMock = jest.spyOn(wrapper.vm, "loadRules");
        const row = wrapper.vm.tableData[0]
        const deleteRuleData = {
            ...row,
            is_deleted: true
        }
        wrapper.vm.openDeleteModal()
        wrapper.find('.delete-yes').trigger('click');
        // if (wrapper.vm.tableData.length > 0){
        // }
        wrapper.vm.deleteRule()
        await sleep(300)
        mock.onPut(
            URLS.RMA_DELETE_RULE(deleteRuleData)
        )
        .reply(200, mocks.delete_rule_data);
        mock.onPost(
            URLS.RMA_RULES_LIST()
        )
        .reply(200, mocks.global_rules_list);
        await flushPromises()
    });
    it('Table headings', () => {
        wrapper.vm.isGlobal = true;
        expect(wrapper.vm.tableHeadings).toStrictEqual([
            'ID',
            'Department',
            'Category',
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
                path: '/administrator/orders/rma/rules'
            },
            {
                name: 'Global Rule',
                path: ''
            }
        ])
        wrapper.vm.isGlobal = false;
        wrapper.vm.channelName = 'Test name';
        wrapper.vm.setBreadcrumbRoutes();
        expect(wrapper.vm.breadcrumbRoutes).toStrictEqual([
            {
                name: 'Return Merchandise Authorisation',
                path: '/administrator/orders/rma/rules'
            },
            {
                name: 'Test name',
                path: ''
            }
        ])
    })

    it('Search', async () => {
        wrapper.vm.searchInput = 'test'
        wrapper.vm.filterRulesList({searchById: false})
        mock.onGet(
            URLS.GET_DEPARTMENTS({
                page_no: 1,
                page_size: 9999,
                search: wrapper.vm.searchInput
            })
        )
        .reply(200, mocks.departments_list)
        mock.onPost(
            URLS.RMA_RULES_LIST()
        )
        .reply(200, mocks.global_rules_list);
        wrapper.vm.searchInput = ''
        const result = wrapper.vm.filterRulesList({searchById: false})
        await sleep(200)
        mock.onPost(
            URLS.RMA_RULES_LIST()
        )
        .reply(200, mocks.global_rules_list);
        expect(result).toBe(undefined)
        wrapper.vm.searchInput = 'asdasfaedcaxadad habsdkhjbadk habsdksahdbask'
        const result2 = wrapper.vm.filterRulesList({searchById: false})
        mock.onGet(
            URLS.GET_DEPARTMENTS({
                page_no: 1,
                page_size: 9999,
                search: wrapper.vm.searchInput
            })
        )
        .reply(200, mocks.departments_list)
        await sleep(200)
        expect(result2).toBe(undefined)
        await flushPromises()
    })

    // it('Checks Default Path', () => {
    //     wrapper.vm.isGlobal = true;
    //     sleep(100).then(() => {
    //         expect(wrapper.vm.defaultPath).toBe('/administrator/orders/rma/rules/global');
    //     })
    //     wrapper.vm.isGlobal = false;
    //     sleep(100).then(() => {
    //         expect(wrapper.vm.defaultPath).toBe('/administrator/orders/rma/rules/custom');
    //     })
    // })
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
    // it('Sets channel data', async () => {
    //     let headerMock = jest.spyOn(wrapper.vm, "setCustomTableHeader");
    //     global.Storage.prototype.setItem('rma_sales_channel_data', JSON.stringify({
    //         dummy: 'dummy',
    //         qc_config: 'custom',
    //         name: 'Test name'
    //     }))
    //     wrapper.vm.isGlobal = false;
    //     wrapper.vm.showCustom = true;
    //     wrapper.vm.channelName = 'Test name';
    //     wrapper.vm.setChannelData();
    //     await sleep(100)
    //     expect(headerMock).toHaveBeenCalled()
    //     expect(global.Storage.prototype.getItem).toHaveBeenCalled();
    //     // expect(wrapper.find('.nitrozen-switch input').value).toBe('true');
    //     // expect(wrapper.find('.jumbotron-title').textContent).toBe('Test name');
    //     expect(wrapper.find('.jumbotron-container').exists()).toBeTruthy();
    //     expect(wrapper.find('.jumbotron-title').text()).toContain('Test name');
    //     await flushPromises()
    // })
    it('Tests custom rules header', async () => {
        const headerWrapper = mount(CustomRulesHeader, {
            propsData: {
                title: 'Test Title',
                desc: 'Test Description',
                btnLabel: 'Test Button'
            }
        });
        let btnClick = jest.spyOn(headerWrapper.vm, "btnClick");
        // let toggleClick = jest.spyOn(headerWrapper.vm, "toggleClick");
        expect(headerWrapper.exists()).toBeTruthy();
        headerWrapper.find('.jumbotron-btns button').trigger('click');
        await sleep(100)
        expect(btnClick).toHaveBeenCalled
        await flushPromises()
        //headerWrapper.find('.jumbotron-btns input').trigger('change');
        // sleep(100).then(expect(toggleClick).toHaveBeenCalled);
    })
    it('Breadcrumb Component', async () => {
        const breadcrumbWrapper = mount(Breadcrumb, {
            propsData: {
                routes: [
                {
                    name: 'Return Merchandise Authorisation',
                    path: '/administrator/rma/rules'
                },
                {
                    name: 'Global Rules',
                    path: ''
                }
                ]
            }
        });
        let redirectTo = jest.spyOn(breadcrumbWrapper.vm, "redirectTo");
        expect(breadcrumbWrapper.vm.$options.props.routes.default.call()).toEqual([])
        expect(wrapper.find('.breadcrumb-parent').exists()).toBeTruthy();
        wrapper.find('.breadcrumb-parent .text').trigger('click');
        // await sleep(100)
        // expect(redirectTo).toBeCalledWith(0, {
        //     name: 'Return Merchandise Authorisation',
        //     path: '/administrator/rma/rules'
        // })
        // await flushPromises()
    });
    // it('Redirection test', () => {
    //     let redirectTo = jest.spyOn(wrapper.vm, "redirectToEdit");
    //     expect(wrapper.find('.row-cta.edit').exists()).toBeTruthy();
    //     wrapper.find('.row-cta.edit').trigger('click');
    //     sleep(100).then(expect(redirectTo).toHaveBeenCalled);
    // });
    // it('Get channel Id', () => {
    //     wrapper.vm.$route.params.sales_channel = 123;
    //     expect(wrapper.vm.getChannelId()).toBe('123');
    // })

    it('search By ID', async () => {
        let paramsMock = jest.spyOn(wrapper.vm, "updateRuleParams")
        let loadRulesMock = jest.spyOn(wrapper.vm, "loadRules")
        wrapper.vm.searchInput = "24"
        wrapper.vm.filterRulesList({searchById: true})
        await sleep(100)
        expect(paramsMock).toHaveBeenCalled()
        expect(loadRulesMock).toHaveBeenCalled()
        mock.onPost(
            URLS.RMA_RULES_LIST()
        )
        .reply(200, mocks.global_rules_list);
        await flushPromises()
    })

    it('redirects to edit localstorage', () => {
        if (wrapper.vm.tableData.length > 0){
            wrapper.vm.redirectToEdit(wrapper.vm.tableData[0])
            expect(global.Storage.prototype.setItem).toHaveBeenCalled();
        }
    })
})
