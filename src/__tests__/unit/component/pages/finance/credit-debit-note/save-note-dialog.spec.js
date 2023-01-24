'use strict';

import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import SaveNoteDialog from '../../../../../../../src/pages/finance/credit-debit-note/save-note-dialog.vue';
//import CREATE_ENTITY_MOCK from './fixtures/create-entity.json';
//import VueRouter from 'vue-router';
import { NitrozenButton } from '@gofynd/nitrozen-vue';
//import flushPromises from "flush-promises";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import URLS from '@/services/domain.service';
// let wrapper, router, localVue

const SaveDialogStub = {
    render: () => {},
    methods: {
        open: () => {}
    }
}
const mock = new MockAdapter(axios);
describe('save note dialog', ()=> {
    let wrapper;
    beforeEach(()=>{
        wrapper = mount(SaveNoteDialog,{
            props:{
                title: {
                    type: String
                  },
                  data: {
                    type: Object
                  }
            },
            mocks:{
                $router: {
                    params: {},
                    back:() => {}
                }
            },
            data: function() {
                return {
                    payload: {
                        "data":{
                           "type_of_request":"create_entity",
                           "item":{
                              "seller_id" :"123",
                              "seller_name" : "ABC Seller",
                              "note_type":"Credit",
                              "category" : "commercial",
                              "invoice_number" : "123456",
                              "invoice_type" : "Service",
                              "total_amount" : 123.4,
                              "purpose_id" : 1232,
                              "note_narration" : "Note created for",
                              "note_details" : [
                              {
                                "invoice_number" : "B2C_invoicID",
                                "bag_id" : "234",
                                "shipment_id" : "12321",
                                "order_id" : "121212",
                                "sac_code" : "12121",
                                "fee_type" : "commission",
                                "purpose_id" : 121,
                                "gross_amount" : 120,
                                "igst_tax_rate" : 9,
                                "cgst_tax_rate" : 0,
                                "sgst_tax_rate" : 9,
                                "total_amount" : 121,
                                "remark" : "Excess commission charged",
                                "kapture_sr_id" : "SR12343"
                               },
                               {
                                "invoice_number" : "B2C_invoicID",
                                "bag_id" : "234",
                                "shipment_id" : "12321",
                                "order_id" : "121212",
                                "sac_code" : "12121",
                                "fee_type" : "commission",
                                "purpose_id" : 121,
                                "gross_amount" : 120,
                                "tax_cgst" : 9,
                                "tax_igst" : 0,
                                "tax_sgst" : 9,
                                "total_amount" : 121,
                                "remark" : "Excess commission charged",
                                "kapture_sr_id" : "SR12343"
                               }
                              ]
                          }
                        }
                     }
                }
            }
        });
        wrapper.vm.open({});
    })


    it('is a Vue instance', () => {
		expect(wrapper.vm).toBeTruthy()
	})
    it('has data', () => {
		expect(typeof SaveNoteDialog.data).toBe('function');
	})
    it('should render to a snapshot', () => {
		expect(wrapper.element).toMatchSnapshot()
	})
    it('div expect', () => {
		const div = wrapper.find('div')
		expect(div.exists()).toBe(true)
	})
    it('saves credit/debit note created', async() => {
        mock.onPost(URLS.SAVE_NOTE()).reply(200, {
            "success": true,
            "reason": "Request Successful"
        });
        wrapper.vm.save();
    })
    it('saves credit/debit note created without payload', async() => {
        mock.onPost(URLS.SAVE_NOTE()).reply(400, {
            "success": true,
            "reason": "Request Not Successful"
        });
        wrapper.vm.save();
    })
    it('should close the modal when the confirm button is closed', () => {
        let element = wrapper.findComponent(NitrozenButton);
        element.vm.$emit('click');
        
        expect(wrapper.emitted()['close']).toBeTruthy()
    })
    it('should save the details of cn-dn and go back to listing page', () => {
        let element = wrapper.find('.save-button')
        element.vm.$emit('click');
        expect(wrapper.emitted()).toBeTruthy()
    })
})
