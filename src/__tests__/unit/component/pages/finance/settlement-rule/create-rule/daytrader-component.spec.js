'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from "flush-promises";
import DaytraderComp from '../../../../../../../pages/finance/settlement-rule/create-rule/daytrader-component.vue';
import { expect } from '@jest/globals';
import DOMAIN_URLS from '../../../../../../../services/domain.service';
import mocks from '../../fixtures/settlement.json';

// Tell Jest to mock this import
jest.mock('lodash/debounce');

let localVue, wrapper, router,store;
const mock = new MockAdapter(axios);
const companyId = '11';

const RoleModal = {
    render: () => {},
    methods: {
        open: () => { },
        close: () => { }
    }
}
describe('Daytrader Component', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [{
                path: '/administrator/finance/settlement-rule/create-rule',
                name: 'create-rule',
                component: DaytraderComp
            }]
        });
        router.push('/administrator/finance/settlement-rule/create-rule');
        jest.useFakeTimers();
        wrapper = mount(DaytraderComp, {
            localVue,
            router,
            propsData: {
                config: mocks.getRuleData.items,
                options: mocks.getRuleData.items,
                cbs_opts: {
                    "brands": [],
                    "locations": [],
                    "company": "18795"
                },
                disabled: false,
                component_id: '',
                component_type: 'create',
                form_data: {
                    "is_tp": false,
                    "defaults": {},
                    "conditional": {},
                    "variable_conditional": {},
                    "transaction_component": {}
                }
            },
            computed: {
                main_config() {
                    return mock.formData.transactional_components
                },
                tran_comp() {
                    return {
                        "commission": "e74f7b21-cc2d-4c75-b2f8-53c2fd284796",
                        "cancellation_fee": "8827cfd7-afbe-4f23-b3bc-531f6824eb8d",
                        "aggregate_liability": "189c6b1a-a8a4-4645-aa0f-b2876947f602"
                    };
                },
                cond_data() {
                    return {
                        "cancellation_fee": {
                            "on": "Bag",
                            "condition": "30"
                        }
                    };
                },
                default_data() {
                    return {
                        "aggregate_liability": 40
                    };
                },
                variable_data(){
                    return {
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
                    };
                }
            } 
        });
        mock.onPost(DOMAIN_URLS.GET_RULE_DATA()).reply(200, mocks.getRuleData);
        mock.onPost(DOMAIN_URLS.GET_BRAND_LIST_FIN()).reply(200, mocks.getBrandList);
        mock.onPost(DOMAIN_URLS.GET_AFFILIATE_LIST_FIN()).reply(200, mocks.getAffiliate);

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

    it('temp test cases', () => {
        wrapper.vm.saveRuleForm();
        wrapper.vm.createVariablePayload();
        wrapper.vm.updateComponent('fixed','commission','transaction');
        wrapper.vm.updateComponent('fixed','commission','conditional');
        wrapper.vm.variableComponent('fixed','commission','transaction');
        wrapper.setData({
            formData: {
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
            selectedFlat: false
        })
        wrapper.vm.changeFlatValue();
    });
    it('temp test cases', () => {
        wrapper.setData({
            formData: {
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
            selectedFlat: true
        })
        wrapper.vm.changeFlatValue();
    });
 
})
