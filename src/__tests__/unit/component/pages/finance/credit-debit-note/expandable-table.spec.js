'use strict';

import { shallowMount, createLocalVue } from "@vue/test-utils";
import ExpandableTable from '@/pages/finance/credit-debit-note/expandable-table.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
// import URLS from '@/services/domain.service';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
// import { NitrozenButton } from '@gofynd/nitrozen-vue';


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

describe('expandable table drawer', () => {

    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        
        router = new VueRouter({
            routes: [{
                path: '/administrator/finance/credit-debit-note/credit-note/credit',
                name: 'credit-note',
                component: ExpandableTable
            }]
        });
        router.push('/administrator/finance/credit-debit-note/credit-note/credit');
        wrapper = shallowMount(ExpandableTable, {
            propsData: {
                readOnly:false,
                preview:false,
                bagData:{
                    "shipment_id": null,
                    "bag_id": null,
                    "order_id": null,
                    "seller_id": "3",
                    "seller_name": "Serviceability Check",
                    "ordering_channel": "fynd",
                    "charge_components": [
                        {
                            "type": "commission_from_brands",
                            "display_name": "Commission From Brands",
                            "sac_code": "998311",
                            "cgst_tax_rate": 9,
                            "sgst_tax_rate": 9,
                            "amount": 4326,
                            "total_amount": 5104
                        }
                    ]
                },
                purpose:[
                    {
                        "text": "Excess Recovery",
                        "value": "303cfd30-3bee-48d3-811c-06de547ef09e"
                    },
                    {
                        "text": "Wrong Recovery",
                        "value": "ea29692a-0579-43c4-9299-d8a576a56efb"
                    },
                    {
                        "text": "Short Recovery",
                        "value": "0221e365-a3d4-4429-90bf-0ac237a72eff"
                    }
                ]
               
            },
            localVue,
            router,
            props:{
                purpose: {
                    type: Array,
                      default: () => {
                        return [];
                      }
                  },
                  bagData: {
                    type: Object,
                    default: () => {
                        
                      }
                  },
                  readOnly: {
                    type: Boolean,
                    default: () => {
                        return false;
                      }
                  },
                  preview: {
                    type: Boolean,
                    default: () => {
                        return false;
                      }
                  }
            },
        });
        await flushPromises();
    });

    it('is a Vue instance', () => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    })
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    })

    it('should change value in component dropdown', async() => {
        
        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const filterInput = wrapper.find('#component-filter');
        filterInput.vm.$emit("searchInputChange","commission_from_brands", "component", 1);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.component).toBe('commission_from_brands');
        await wrapper.vm.$nextTick();
        filterInput.vm.$emit("change","commission_from_brands", "component", 'commission_from_brands', 1);
        expect(wrapper.vm.componentSelected.errorMsg[1]).toBe(false);
        await wrapper.vm.$nextTick();
        filterInput.vm.$emit("change","", "component", 'commission_from_brands', 1);
        expect(wrapper.vm.componentSelected.errorMsg[1]).toBe(true);


    })
 

    it('should change value in purpose dropdown', async() => {
        
        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const filterInput = wrapper.find('#component-purpose');
        filterInput.vm.$emit("change","0221e365-a3d4-4429-90bf-0ac237a72eff" ,"purpose" ,"0221e365-a3d4-4429-90bf-0ac237a72eff", 1);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.purposeSelected.errorMsg[1]).toBe(false);
        await wrapper.vm.$nextTick();
        filterInput.vm.$emit("change","" ,"purpose" ,"0221e365-a3d4-4429-90bf-0ac237a72eff", 1);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.purposeSelected.errorMsg[1]).toBe(true);
        await wrapper.vm.$nextTick();
        filterInput.vm.$emit("change", 1);
        
    })

    it('Load Prop Data when readonly is true', async() => {
        
        await flushPromises();
        await wrapper.vm.populateFromProp();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        
    })

    it('should change amount on typing', async() => {
        
        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const filterInput = wrapper.find('#component-amount');
        filterInput.vm.$emit("input",123, "amount", 123, 1);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.amount.errorMsg[1]).toBe(false);
        await wrapper.vm.$nextTick();
        filterInput.vm.$emit("input","" , "amount", "123", 1);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.amount.errorMsg[1]).toBe(true);
        await wrapper.vm.$nextTick();
        filterInput.vm.$emit("input", 1);
      
        
    })

    it('check all conditions for validate amount', async() => {

        wrapper.setData({
            amount: {
                value: [],
                errorMsg: [],
                type: 'amount',
                validationError: ''
              },
        })

        await wrapper.vm.validateAmount(1);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.amount.errorMsg[1]).toBe(true);

        wrapper.setData({
            amount: {
                value: [10000],
                errorMsg: [],
                type: 'amount',
                validationError: ''
              },
        })

        await wrapper.vm.validateAmount(1);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.validateErrIndex).toBe(1);


    })

    it('should save remarks', async() => {
        
        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const filterInput = wrapper.find('#component-remark');
        filterInput.vm.$emit("input","test", "remark", "test", 1);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.remark.errorMsg[1]).toBe(false);
        await wrapper.vm.$nextTick();
        filterInput.vm.$emit("input","" , "remark", "test", 1);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.remark.errorMsg[1]).toBe(true);
        await wrapper.vm.$nextTick();
        filterInput.vm.$emit("input", 1);
      
        
    })

    it('delete row if more than 1 row', async() => {
        
        await flushPromises();

        let nextFnCall = jest.spyOn(wrapper.vm, 'spliceAllFields');

        wrapper.setData({
            tableSize: 3
        })

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const filterInput = wrapper.find('#icon-delete');
        filterInput.trigger("click",2, {
            "isTrusted": true
        });
        await wrapper.vm.$nextTick();
        expect(nextFnCall).toHaveBeenCalled();
      
        
    })

    it('delete row error on one row', async() => {
        
        await flushPromises();

        let showErrorMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showError');

        wrapper.setData({
            tableSize: 1
        })

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const filterInput = wrapper.find('#icon-delete');
        filterInput.trigger("click",1, {
            "isTrusted": true
        });
        await wrapper.vm.$nextTick();
        expect(showErrorMethod).toHaveBeenCalled();
      
        
    })


})

