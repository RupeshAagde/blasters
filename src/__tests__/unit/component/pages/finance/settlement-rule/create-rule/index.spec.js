'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import DOMAIN_URLS from '../../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import CreateRule from '../../../../../../../pages/finance/settlement-rule/create-rule/index.vue';
import mocks from '../../fixtures/settlement.json';
import ADMIN_URLS from '@/services/admin-url.service';

let localVue, wrapper, router,store;
const mock = new MockAdapter(axios);
const companyId = '11';

let form = {
    "name": "",
    "slug_fields": [],
    "slug_values": {
        "channel": [],
        "company": [],
        "brand": [],
        "location": [],
        "affiliate": []
    },
    "type_of_request": "create_entity",
    "rule_start_date": null,
    "rule_end_date": null,
    "settle_cycle_period": {
        "mall": 0,
        "warehouse": 0,
        "high_street": 0
    },
    "settlement_type": "weekly",
    "transactional_components": {
        "is_tp": false,
        "defaults": {
            "aggregate_liability": 40
        },
        "conditional": {
            "cancellation_fee": {
                "on": "Bag",
                "condition": "30"
            }
        },
        "source_components": [
            "quantity",
            "price_marked",
            "value_of_good"
        ],
        "variable_conditional": {
            "commission": {
                "slab": {
                    "cycle": "weekly",
                    "expression": "No condition, only digits : 0",
                    "expression_variable_used": [
                        "net_sales"
                    ]
                },
                "condition": {
                    "whichever_is_lower": false,
                    "whichever_is_higher": true
                }
            }
        },
        "transaction_component": {
            "commission": "e74f7b21-cc2d-4c75-b2f8-53c2fd284796",
            "cancellation_fee": "8827cfd7-afbe-4f23-b3bc-531f6824eb8d",
            "aggregate_liability": "189c6b1a-a8a4-4645-aa0f-b2876947f602"
        }
    }
}

let formDataVal = {
    "form": {
        "name": "",
        "slug_fields": [],
        "slug_values": {
            "channel": [],
            "company": [],
            "brand": [],
            "location": [],
            "affiliate": []
        },
        "type_of_request": "create_entity",
        "rule_start_date": null,
        "rule_end_date": null,
        "settle_cycle_period": {
            "mall": 0,
            "warehouse": 0,
            "high_street": 0
        },
        "settlement_type": "weekly",
        "transactional_components": {
            "is_tp": false,
            "defaults": {
                "aggregate_liability": 40
            },
            "conditional": {
                "cancellation_fee": {
                    "on": "Bag",
                    "condition": "30"
                }
            },
            "source_components": [
                "quantity",
                "price_marked",
                "value_of_good"
            ],
            "variable_conditional": {
                "commission": {
                    "slab": {
                        "cycle": "weekly",
                        "expression": "No condition, only digits : 0",
                        "expression_variable_used": [
                            "net_sales"
                        ]
                    },
                    "condition": {
                        "whichever_is_lower": false,
                        "whichever_is_higher": true
                    }
                }
            },
            "transaction_component": {
                "commission": "e74f7b21-cc2d-4c75-b2f8-53c2fd284796",
                "cancellation_fee": "8827cfd7-afbe-4f23-b3bc-531f6824eb8d",
                "aggregate_liability": "189c6b1a-a8a4-4645-aa0f-b2876947f602"
            }
        }
    },
    "compType": "edit"
}

jest.useFakeTimers();

const RoleModal = {
    render: () => {},
    methods: {
        open: () => { },
        close: () => { }
    }
}
describe('Create-Rule', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [{
                path: '/administrator/finance/settlement-rule/create-rule',
                name: 'create-rule',
                component: CreateRule
            }]
        });
        router.push('/administrator/finance/settlement-rule/create-rule');
        wrapper = mount(CreateRule, {
            localVue,
            router,
            stubs: {
                'jsonView': RoleModal,
            }
        });
        mock.onPost(DOMAIN_URLS.GET_COMPANY_LIST_FIN()).reply(200, mocks.getCompanyList);
        mock.onPost(DOMAIN_URLS.GET_DATA_FIN()).reply(200, mocks.getRuleList);
        mock.onPost(DOMAIN_URLS.GET_RULE_DATA()).reply(200, mocks.getRuleData);
        
        // mock.onPost(DOMAIN_URLS.GET_UPLOAD_URL()).reply(200, mocks.confirmValidation);

        await flushPromises();
    });

    it('is a vue instance', async() => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
    
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('when page loads as edit rule', () => {
        wrapper.vm.editRule({
            id:'bdd28cd0-f16f-44a9-b03b-f6abaef2d835'
        });
    });

    it('when comapny is searched', () => {
        wrapper.vm.searchCompany({
            e:'fuc'
        });
    });

    it('when rule is edited and validation fails', () => {
        wrapper.vm.createPayload({
            compData: formDataVal
        });
    });
    // it('when rule is edited and validation passes',  async() => {

    //     await flushPromises();

    //     wrapper.setData({
    //         formData : form,
    //     });

    //     await wrapper.vm.$forceUpdate();
    //     await wrapper.vm.$nextTick();
    
    //     wrapper.vm.createPayload({
    //         compData: formDataVal
    //     });
    // });
    // it('when rule is edited and validation passes', () => {
        
    //     wrapper.vm.generatePayload({
    //         compData: formDataVal
    //     });
    // });

    //run this via action on rule function

    it('edit rule data', () => {
        wrapper.vm.editRuleData();
    });  


    it('create rule', () => {
        wrapper.vm.createRule();
    });  

    it('When value selected in company dropdown', () => {
        wrapper.vm.filterByCompany();
    });  

    it('When location changed', () => {
        wrapper.vm.showLocationValue();
    });  

    it('When channel value is changed', () => {
        wrapper.vm.filterByChannel();
    });  
    

    
    
    
})
