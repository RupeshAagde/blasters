'use strict';

import { shallowMount, createLocalVue, mount } from "@vue/test-utils";
import CreditNote from '@/pages/finance/credit-debit-note/create-cn-dn.vue';
//import SaveNoteDialog from '../../../../../pages/finance/save-note-dialog.vue';
//import GoBackDialog from '../../../../../pages/finance/go-back-dialog.vue';
//import ExpandableTable from '../../../../../pages/credit-debit-note/expandable-table.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from '@/services/domain.service';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
//import { NitrozenButton } from '@gofynd/nitrozen-vue';
import PURPOSE_LIST_DATA from './fixtures/purpose-list.json';
import USER_MOCK from './fixtures/user-mock.json';
import createCn from './fixtures/create-cn.json';
import SERVICE_INVOICE_DETAILS_MOCK from './fixtures/service-invoice-details-mock.json';
import NOTE_DETAIL_MOCK from './fixtures/note-detail.json';
import { flush } from "@sentry/node";
//import SERVICE_INVOICE_DETAIL_MOCK from './fixtures/service-invoice-details-mock.json';

let wrapper, router, localVue;
const mock = new MockAdapter(axios);

const clickToCallDialog = {
    render: () => {},
    methods: {
        open: () => {},
    },
};
const purposeParamas = {
    "data":{
        "table_name":"credit_debit_note_purpose",
        "filters":{
            "note_type":"credit",
            "category" :"gst_service"
        },
        "project":[
            "id",
            "name",
            "priority"
        ],
        "order_by":"priority Desc"
    }
}


describe('credit-debit-note page', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [
                {
                    path: 'finance/credit-debit-note/credit-note/:noteType/:noteId?/:preview?/:isApprover?/:documentNo?',
                    component: CreditNote,
                },
            ],
        });
        router.push('finance/credit-debit-note/credit-note/credit/0ab27f6b-cf2e-4f57-a482-8ffe06971ad2/preview/false/BCN%2F00031%2F22-23');
        mock.onPost(URLS.GET_PURPOSE_DATA(purposeParamas)).reply(200, PURPOSE_LIST_DATA);

        

        wrapper = mount(CreditNote, {
            localVue,
            router,
            computed: {
                userData: () => {
                    return USER_MOCK.computedFix;
                }
            },
            data: function () {
                return {
                    selectedType: 'commercial',
                    sellerId: {
                        value: 'dummy',
                        errorMessage: '',
                        isValid: false
                    },
                    isValidForm: {},
                    calledFromChild: true,
                    sellerName:'',
                    ilteredCnTypes : [
                        {
                            text:"Commercial",
                            value:"commercial",
                            description:"Commercial Credit notes are raised against invoice number and seller id. An example where a commercial credit note needs to be issued is when an order is lost by logistic service provider, the amount recovered by logistic service provider is credited to the seller."
                        },
                        {
                            text:"GST Fee Invoice",
                            value:"gst_fee",
                            description:"Gst fee note is raised against an existing fee invoice component if theres an issue that affects the entire invoice."
                        },
                        {
                            text:"GST Service Invoice",
                            value:"gst_service",
                            description:"Gst Service is raised against an existing service invoice component. One of the events in which gst service note needs to be issued is the invoice difference of initial shipping cost charged to Seller based on estimates and actual cost charged by logistic service provider."
                        }
                    ],
                    noteDesc: '',
                    isDisabled: true,
                    isRequired: true,
                    isPreview: false,
                    purposeList: [],
                    noteDetailsMap: [],
                    purposeType: {
                        value: '',
                        errorMessage: '',
                        isValid: false
                    },
                    shipmentId: {
                        value: ['16312857931831923777'],
                        errorMessage: '',
                        isValid: false
                    },
                    feeInvoiceDetails:[],
                    // see if required
                    shipmentIdCommercial: '',
                    invoiceNumber: {
                        value: '',
                        errorMessage: '',
                        isValid: false
                        // regex: /3P(C|D)N<\d{2}><\d{8}>/
                    },
                    bagsRemoved: [],
                    shippingFees: {
                        value: '',
                        errorMessage: '',
                        isValid: false
                    },
                    creditNoteAmount: {
                        value: '',
                        errorMessage: '',
                        regex: /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
                        isValid: false
                    },
                    kaptureId: '',
                    remarks: {
                        value: '',
                        errorMessage: '',
                        isValid: false
                    },
                    noteNarration: {
                        value: 'dummt',
                        errorMessage: '',
                        isValid: false
                    },
                    bagId: {
                        value: [],
                        data:[],
                        errorMessage: '',
                        isValid: false
                    },
                    bagList: [],
                    //payload: {},
                    noteType: '',
                    noteId: '',
                    title:'',
                    dropdownLabel: '',
                    sacCode: '',
                    shipmentList: [],
                    currency: '₹',
                    bagShipmentMapping: {},
                    componentList: [],
                    readOnlyMode: false,
                    tab: createCn.tabInit,
                    chips : 'miltiple search, text',
                    noteDetails: [
                        {
                            "id": "a10749ef-b235-43a4-94b2-71b33b2c2f44",
                            "note_id": "7053f6cb-5ff5-4b9e-b562-5b2197a9a4ff",
                            "invoice_number": "B2C_invoicID",
                            "bag_id": "bag_id",
                            "shipment_id": "12321",
                            "order_id": "121212",
                            "sac_code": "12121",
                            "fee_type": "commission",
                            "purpose_id": "d1f13b02-ab71-4832-83f3-9ec1e0af8928",
                            "gross_amount": 120.0,
                            "igst_tax_rate": 9.0,
                            "cgst_tax_rate": 0.0,
                            "sgst_tax_rate": 9.0,
                            "total_amount": 121.0,
                            "remark": "Excess commission charged",
                            "kapture_sr_id": "SR12343"
                        }
                    ],
                    editingMode: true,
                    noteDetailsMap: {
                        "120327301":{
                        "bag_id": "12032730",
                        "cgst_tax_rate": 0,
                        "check_amount": 45.38,
                        "fee_type": "commission",
                        "gross_amount": 12,
                        "id": null,
                        "igst_tax_rate": 18,
                        "index": 1,
                        "is_active": true,
                        "kapture_sr_id": null,
                        "purpose_id": "d1f15b02-ab71-4832-83f3-9ec1e0af3929",
                        "remark": "fgg",
                        "sac_code": "996211",
                        "seller_id": "46",
                        "seller_name": "RELIANCE BRANDS LIMITED",
                        "sgst_tax_rate": 0,
                        "shipment_id": "16312857931831923777",
                        "total_amount": 14.16
                        }
                    }
                };
            }
        });
        await flushPromises();
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('is a Vue instance', () => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    // it('should call saveCN method on click of save button', async() => {
    //     let element = wrapper.findComponent(NitrozenButton);
    //     await wrapper.vm.$nextTick();
    //     let saveCNMethod = jest.spyOn(wrapper.vm,'saveCN');
    //     element.vm.$emit('click');
    //     expect(saveCNMethod).toHaveBeenCalled();
    // })

    // it('should open save dialog', async() => {
    //     //const wrapper = shallow(<CreditNote />);
    //     expect(wrapper.findComponent(SaveNoteDialog).isVisible()).toBe(true)
    // });

    // it('should open go back dialog', () => {
    //     expect(wrapper.findComponent(GoBackDialog).isVisible()).toBe(true)
    // })

    it('Should search in the dropdown when given the input', async() => {
        //const getListfn = jest.spyOn(wrapper.vm, 'getListData');
        await flushPromises();
        wrapper.setData({
            purposeList: [
                {
                    text: 'Approved',
                    value: 'approved'
                }
            ],
            filteredPurposeList: [
                {
                    text: 'Approved',
                    value: 'approved'
                }
            ],
            purposeType: {
                value: '',
                errorMessage: '',
                isValid: false
            },
            selectedType: 'commercial'

        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const statusDD = wrapper.findComponent({ref: 'purpose-dropdown'});
        statusDD.vm.$emit('searchInputChange',{
            text: 'Approved',
            value: 'approved'
        });
        expect(wrapper.vm.filteredPurposeList.length).toBe(1);
    });

    it('Should search in the dropdown when given input is empty', async() => {
        //const getListfn = jest.spyOn(wrapper.vm, 'getListData');
        await flushPromises();
        wrapper.setData({
            purposeList: [
                {
                    text: 'Approved',
                    value: 'approved'
                }
            ],
            filteredPurposeList: [
                {
                    text: 'Approved',
                    value: 'approved'
                }
            ],
            purposeType: {
                value: '',
                errorMessage: '',
                isValid: false
            },
            selectedType: 'commercial'

        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const statusDD = wrapper.findComponent({ref: 'purpose-dropdown'});
        statusDD.vm.$emit('searchInputChange',{
            text: '',
            value: ''
        });
        expect(wrapper.vm.filteredPurposeList.length).toBe(1);
    });

    it('fetch the details of invoice type', async() => {
        await flushPromises();
        wrapper.setData({
            invoiceNumber: {
                value: 'BINV/00014/22-23',
                errorMessage: '',
                isValid: false
            },
        })
        const keyFun = jest.spyOn(wrapper.vm, 'getCnDetails');
        keyFun('commerical');
        keyFun();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.feeInvoiceDetails.length).toBe(0);
    });

    it('read Only the data populate', async() => {
       wrapper.vm.$router.replace({path: 'finance/credit-debit-note/credit-note', params: { noteType: 'credit', noteId: '0ab27f6b-cf2e-4f57-a482-8ffe06971ad2', preview: 'preview'}});
        const readOnly = jest.spyOn(wrapper.vm, 'readOnlyData');
        readOnly();
        mock.onPost(URLS.GET_NOTE_DATA()).reply(200,NOTE_DETAIL_MOCK.gstFee);
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect.anything();
    });

    it('should return the keypressed', async() => {
        await flushPromises();
        const keyFun = jest.spyOn(wrapper.vm, 'omit_special_char');
        keyFun({keyCode: 47, which:'enter', preventDefault(){} });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect.anything();
    });

    it('should close the approver drawer', async() => {
        await flushPromises();
        const keyFun = jest.spyOn(wrapper.vm, 'closeApproverDrawerView');
        keyFun(true);
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.quickApproveView).toBe(false);
    });

    it('should get seller details', async() => {
        await wrapper.vm.getSellerDetails();
    });

    it('this function populates the the data in form in readonly mode', async() => {
        await flushPromises();
        wrapper.setData({
            tab: {
                category: 'gst_service',
            }
        });
        wrapper.vm.readOnlyData();
    })

    it('reset form', async() => {
        wrapper.setData({
            kaptureId: {
                value: ''
            }
        })
        wrapper.vm.resetForm();
    })

    /* it('should reset form', () => {
        wrapper.vm.resetForm();
    }) */

    it('disable save button gst service', () => {
        wrapper.setData({
            selectedType: 'gst_service'
        })
        wrapper.vm.disableSave();
    })

    it('disable save button gst fee' , () => {
        wrapper.setData({
            selectedType: 'gst_fee'
        })
        wrapper.vm.disableSave();
    })

    it('change placeholder in dropdown', () => {
        wrapper.vm.displayPlaceholder(1);
    })

    it('change placeholder in dropdown', () => {
        wrapper.vm.displayPlaceholder(2);
    })

    it('should get commercial payload for update', () => {
        wrapper.vm.getCommercialPayload('edit_entity');
    })

    it('should get commercial payload for create', () => {
        wrapper.vm.getCommercialPayload('create_entity');
    })

    it('should get service invoice payload for create',() => {
        wrapper.vm.getServiceInvoicePayload('create_entity');
    })

    it('should get service invoice payload for update',() => {
        wrapper.setData({
            bagsRemoved: [],
            noteDetailsMap: [
                {
                    'bag_id': "47814",
                    'cgst_tax_rate': 0,
                    'fee_type': "cancellation_penalty",
                    'gross_amount': 1,
                    'id': "7f826f78-abe3-4bc1-b258-e643c0365b3f",
                    'igst_tax_rate': 0,
                    'invoice_number': null,
                    'kapture_sr_id': null,
                    'note_id': "2d49fc53-2965-434b-83b0-f1e6a64e471b",
                    'order_id': null,
                    'purpose_id': "b5e2cf03-8bb6-4fcd-ad88-0efb611195da",
                    'remark': "r20",
                    'sac_code': "999794",
                    'sgst_tax_rate': 0,
                    'shipment_id': "16585652884651330395K",
                    'total_amount': 1,
                },
            ],
            tab: createCn.pending,
            noteDetails: createCn.pending.note_details,
        })
        wrapper.vm.getServiceInvoicePayload('edit_entity');
    });

    it('should get service invoice payload for update',() => {
        wrapper.setData({
            bagsRemoved: ['47814','47815'],
            noteDetailsMap: {
                "bag_id": "412034",
                "shipment_id": "16726405181421038384",
                "row": [
                    {
                        "fee_type": "commission_from_brands",
                        "purpose_id": "8796f00b-ce27-4804-9307-87d22e96a1d5",
                        "gross_amount": 123,
                        "sac_code": "998311",
                        "sgst_tax_rate": 9,
                        "igst_tax_rate": 0,
                        "cgst_tax_rate": 9,
                        "remark": "test",
                        "total_amount": 145.14,
                        "bag_id": "412034",
                        "shipment_id": "16726405181421038384",
                        "id": "221e761a-2cf2-4517-9bb3-b64107328536"
                    }
                ],
                "charge_components": [
                    {
                        "type": "commission_from_brands",
                        "display_name": "Commission From Brands",
                        "sac_code": "998311",
                        "sgst_tax_rate": 9,
                        "cgst_tax_rate": 9,
                        "amount": 564,
                        "total_amount": 665
                    }
                ],
                "order_id": "FY63B278050E706A0413",
                "ordering_channel": "fynd"
            },
            tab: createCn.pending
        })
        wrapper.vm.getServiceInvoicePayload('edit_entity');
    })

    it('should get fee invoice payload', () => {
        wrapper.vm.getFeeInvoicePayload('create_entity');
    })

    it('should get fee invoice payload', () => {
        wrapper.vm.getFeeInvoicePayload('edit_entity');
    })

    it('opens save dialog box for commercial note', () => {
        wrapper.vm.saveCN('create_entity');
    })

    it('opens save dialog box for commercial note', () => {
        wrapper.setData({
            selectedType: 'gst_fee'
        })
        wrapper.vm.saveCN('create_entity');
    })

    it('opens save dialog box for commercial note', () => {
        wrapper.setData({
            selectedType: 'gst_service'
        })
        wrapper.vm.saveCN('create_entity');
    })

    it('opens go back dialog', () => {
        wrapper.vm.goBackDialog();
    })

    it('opens go back dialog if case', () => {
        wrapper.setData({
            isPreview: true
        })
        wrapper.vm.goBackDialog();
    })

    it('tests dialogClosed method', () => {
        wrapper.vm.$dialogClosed();
    })


    it('selects bags', () => {
        wrapper.setData({
            bagId: {
                data: [
                    {
                        'bagId':'1'
                    },
                    {
                        'bagId':'2'
                    }
                ],
                value: ['1','2']
            }
        })
        wrapper.vm.selectBags();
    })

    it('selects bags', () => {
        wrapper.setData({
            bagId: {
                data: [],
                value: []
            }
        })
        wrapper.vm.selectBags();
    })

    it('selects bags not editng mode', () => {
        wrapper.setData({
            editingMode: false,
            bagId: {
                data: [],
                value: []
            }
        })
        wrapper.vm.selectBags();
    })

    it('selects bags not editing mode', () => {
        wrapper.setData({
            editingMode: false,
            bagId: {
                data: [
                    {
                        'bagId':'1'
                    },
                    {
                        'bagId':'2'
                    }
                ],
                value: ['1','2']
            }
        })
        wrapper.vm.selectBags();
    })

    it('emits to parent',() => {
        wrapper.setData({
            noteDetailsMap: {
                'dummy bag id1': {
                    "bag_id": "dummy bag id",
                    "cgst_tax_rate": 9,
                    "fee_type": "labelling_fee",
                    "gross_amount": 300,
                    "igst_tax_rate": 0,
                    "index": 1,
                    "is_active": true,
                    "kapture_sr_id": null,
                    "purpose_id": "8c0fa6ab-9ae2-450c-bdae-1d7bbb0b039b",
                    "remark": "r123",
                    "sac_code": "998540",
                    "sgst_tax_rate": 9,
                    "shipment_id": "dummy shipment id",
                    "total_amount": "12",
                }
            }
        })
        wrapper.vm.ChildToParent({
            "bag_id": "dummy bag id",
            "cgst_tax_rate": 9,
            "fee_type": "labelling_fee",
            "gross_amount": 300,
            "igst_tax_rate": 0,
            "index": 1,
            "is_active": true,
            "kapture_sr_id": null,
            "purpose_id": "8c0fa6ab-9ae2-450c-bdae-1d7bbb0b039b",
            "remark": "r123",
            "sac_code": "998540",
            "sgst_tax_rate": 9,
            "shipment_id": "dummy shipment id",
            "total_amount": "12",
        
        });
    })

    it('emits to parent',() => {
        
        wrapper.vm.ChildToParent({
            "bag_id": "dummy bag id",
            "cgst_tax_rate": 9,
            "fee_type": "labelling_fee",
            "gross_amount": 300,
            "igst_tax_rate": 0,
            "index": 1,
            "is_active": true,
            "kapture_sr_id": null,
            "purpose_id": "8c0fa6ab-9ae2-450c-bdae-1d7bbb0b039b",
            "remark": "r123",
            "sac_code": "998540",
            "sgst_tax_rate": 9,
            "shipment_id": "dummy shipment id",
            "total_amount": "12",
        
        });
    })

    it('emits to parent',() => {
        wrapper.vm.ChildToParent(false);
    })

    it('validates form for seller ID', () => {
        wrapper.vm.validateForm('sellerId');
    })

    it('validates form for seller ID empty', () => {
        wrapper.setData({
            sellerId: {
                value: '',
                errorMessage: '',
                isValid: false
            }
        })
        wrapper.vm.validateForm('sellerId');
    })

    it('validates form for shipping fee', () => {
        wrapper.vm.validateForm('shippingFee');
    })

    it('validates form for shipping fee non empty', () => {
        wrapper.setData({
            shippingFees: {
                value: 'dummy',
                errorMessage: '',
                isValid: false
            }
        })
        wrapper.vm.validateForm('shippingFee');
    })

    it('should Validate the amount when entered', async() => {
        await flushPromises();
        wrapper.setData({
            selectedType: 'commercial',
            creditDebitNoteAmount:{
                value: 0,
            },
            noteType: 'credit'

        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const statusDD = wrapper.findComponent({ref: 'input-amount'});
        statusDD.vm.$emit('input','amount');
        expect(wrapper.vm.noteType).toBe('credit');
    });
    it('should Validate the invoice number when entered', async() => {
        await flushPromises();
        wrapper.setData({
            selectedType: 'commercial',
            creditDebitNoteAmount:{
                value: createCn.max,
            },
            invoiceNumber: {
                errorMessage: '',
                isValid: false
            },
            feeType: {
                value: 'component type',
                errorMessage: '',
                isValid: false
            },
            kaptureId: {
                value: 'component type',
                errorMessage: '',
                isValid: false
            },
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        wrapper.vm.validateForm('feeType');
        wrapper.vm.validateForm('kaptureId');
        const statusDD = wrapper.findComponent({ref: 'invoice-number'});
        statusDD.vm.$emit('input','invoiceNumber');
        expect(wrapper.vm.invoiceNumber.isValid).toBe(true);
    });

    it('validates form for credit amount', () => {
        wrapper.setData({
            kaptureId: {
                value: '',
            },
            shipmentIdCommercial: {
                value: '',
            }
        })
        wrapper.vm.validateForm('amount');
        wrapper.vm.validateForm('feeType');
        wrapper.vm.validateForm('kaptureId');
        wrapper.vm.validateForm('shipmentIdCommercial');
    })

    it('validates form for credit amount for 0', () => {
        wrapper.setData({
            creditNoteAmount: {
                value: '0',
                errorMessage: '',
                regex: /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
                isValid: false
            }
        })
        wrapper.vm.validateForm('amount');
    })

    it('validates form for credit amount negative amount', () => {
        wrapper.setData({
            creditNoteAmount: {
                value: '-1',
                errorMessage: '',
                regex: /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
                isValid: false
            }
        })
        wrapper.vm.validateForm('amount');
    })

    it('validates form for credit amount more than 2 digits after decimal', () => {
        wrapper.setData({
            creditNoteAmount: {
                value: '22.22222',
                errorMessage: '',
                regex: /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
                isValid: false
            }
        })
        wrapper.vm.validateForm('amount');
    })

    it('validates form for credit correct amount', () => {
        wrapper.setData({
            creditNoteAmount: {
                value: '100',
                errorMessage: '',
                regex: /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
                isValid: false
            }
        })
        wrapper.vm.validateForm('amount');
    })

    it('validates form for remarks', () => {
        wrapper.vm.validateForm('remarks');
    })

    it('validates form for remarks non empty', () => {
        wrapper.setData({
            remarks: {
                value: 'dummy',
                errorMessage: '',
                isValid: false
            }
        })
        wrapper.vm.validateForm('remarks');
    })

    it('validates form for note narration', () => {
        wrapper.vm.validateForm('noteNarration');
    })


    it('validates form for note narration for empty', () => {
        wrapper.setData({
            noteNarration: {
                value: '',
                errorMessage: '',
                isValid: false
            }
        })

        wrapper.vm.validateForm('noteNarration');
    })

    it('validates form for invoice number', () => {
        wrapper.vm.validateForm('invoiceNumber');
    })

    it('validates form for invoice number non empty', () => {
        wrapper.setData({
            invoiceNumber: {
                value: 'dummy',
                errorMessage: '',
                isValid: false
                // regex: /3P(C|D)N<\d{2}><\d{8}>/
            },
        })
        wrapper.vm.validateForm('invoiceNumber');
    })

    it('validates form for purpose', () => {
        wrapper.vm.validateForm('purpose');
    })

    it('validates form for remarks non empty', () => {
        wrapper.setData({
            purposeType: {
                value: 'dummy',
                errorMessage: '',
                isValid: false
            }
        })
        wrapper.vm.validateForm('purpose');
    })

    it('validates form for shipment Id', () => {
        wrapper.vm.validateForm('shipmentId');
    })

    it('validates form for shipment Id empty' , () => {
        wrapper.setData({
            shipmentId: {
                value: [],
                errorMessage: '',
                isValid: false
            }
        })
        wrapper.vm.validateForm('shipmentId');
    })

    it('validates form for shipment more than 10 shipments' , () => {
        wrapper.setData({
            shipmentId: {
                value: ['1','2','3','4','5','6','7','8','9','20','11'],
                errorMessage: '',
                isValid: false
            }
        })
        wrapper.vm.validateForm('shipmentId');
    })

    it('validates form for bag Id', () => {
        wrapper.vm.validateForm('bagId');
    })

    it('validates form for bag Id non empty', () => {
        wrapper.setData({
            bagId: {
                value: ['gdsg'],
                data:['gsdg'],
                errorMessage: '',
                isValid: false
            }
        })
        wrapper.vm.validateForm('bagId');
    })

    it('reset seller name', () => {
        wrapper.vm.resetSellerName();
    })

    it('gets read only data', async() => {
        let params = {
            data:{
                note_id:'2db2ae87-a4ac-4909-a48d-b635aa62c8d9', 
            }
        }

        mock.onPost(URLS.GET_NOTE_DATA(params)).reply(200, NOTE_DETAIL_MOCK);
        wrapper.vm.readOnlyData();
    })

    it('gets read only data', async() => {
        wrapper.setData({
            tab: {
                'category': 'gst_service',
                'approved_at': null,
                'approved_by': null,
                'approver_remark': null,
                'created_at': 1658918093,
                'created_by': "shivanishah_fynd_external_com_45981",
                'document_number': "3PCN292310000038",
                'id': "2d49fc53-2965-434b-83b0-f1e6a64e471b",
                'invoice_number': "3PDF292200000051",
                'invoice_type': "service",
                'is_active': true,
                'note_details': [
                    {
                        'bag_id': "47814",
                        'cgst_tax_rate': 0,
                        'fee_type': "cancellation_penalty",
                        'gross_amount': 1,
                        'id': "7f826f78-abe3-4bc1-b258-e643c0365b3f",
                        'igst_tax_rate': 0,
                        'invoice_number': null,
                        'kapture_sr_id': null,
                        'note_id': "2d49fc53-2965-434b-83b0-f1e6a64e471b",
                        'order_id': null,
                        'purpose_id': "b5e2cf03-8bb6-4fcd-ad88-0efb611195da",
                        'remark': "r20",
                        'sac_code': "999794",
                        'sgst_tax_rate': 0,
                        'shipment_id': "16585652884651330395K",
                        'total_amount': 1,
                    },
                    {
                        'bag_id': "47857",
                        'cgst_tax_rate': 0,
                        'fee_type': "fixed_fee",
                        'gross_amount': 12,
                        'id': "6e8af381-1199-472c-844c-b19510373436",
                        'igst_tax_rate': 18,
                        'invoice_number': null,
                        'kapture_sr_id': null,
                        'note_id': "2d49fc53-2965-434b-83b0-f1e6a64e471b",
                        'order_id': "FY62DBFF770176467297",
                        'purpose_id': "20354d7a-e4fe-47af-8ff6-187bca92f3f1",
                        'remark': "r20",
                        'sac_code': "996211",
                        'sgst_tax_rate': 0,
                        'shipment_id': "16585849523081711463K",
                        'total_amount': 14.16,
                    }
                ],
                'note_narration': "note narration",
                'note_type': "credit",
                'pdf_s3_url': null,
                'purpose_id': "b5e2cf03-8bb6-4fcd-ad88-0efb611195da",
                'seller_id': "93",
                'seller_name': "CHANDRA NAYAK BHASKAR NAYAK",
                'status': "Init",
                'total_amount': 18.52
            }
        })
        let params = {
            data:{
                note_id:'2db2ae87-a4ac-4909-a48d-b635aa62c8d9', 
            }
        }

        mock.onPost(URLS.GET_NOTE_DATA(params)).reply(200, NOTE_DETAIL_MOCK);
        wrapper.vm.readOnlyData();
    })

    it('opens in edit mode', () => {
        wrapper.vm.editMode();
    })


    it('gets search text from chips', () => {
        let event = {
            ketCode : '32'
        }
        wrapper.vm.getSearchText(event);
    })

    it('adds search text', () => { 
        wrapper.vm.addSearchText();
    })

    it('removes shipment id from chips', () => {
        wrapper.vm.removeSearchInput(0);
    })

    it('displays number of shipments added', () => {
        wrapper.vm.selectShipment();
    })

    it('returns formatted date', () => {
        wrapper.vm.dateFormatted(1657578538);
    })

    it('tests show tick method', () => {
        wrapper.vm.showTick();
    })

    it('tests rountToTwo', () => {
        wrapper.vm.roundToTwo('1.222');
    })

    it(' disables edit gst fee', () => {
        wrapper.setData({
            selectedType: 'gst_fee'
        })
        wrapper.vm.disableEdit();
    })

    it(' disables edit gst fee else', () => {
        wrapper.setData({
            selectedType: 'gst_fee',
            isCalledFromChild: false
        })
        wrapper.vm.disableEdit();
    })

    it(' disables edit gst service', () => {
        wrapper.setData({
            selectedType: 'gst_service'
        })
        wrapper.vm.disableEdit();
    })

    it(' disables edit gst service', () => {
        wrapper.setData({
            selectedType: 'gst_service',
            isValidForm: {'key': 'value'},
            isCalledFromChild: true
        })
        wrapper.vm.disableEdit();
    })

    it('tests unselect bags', () => {
        wrapper.setData({
            bagList: [
                {
                    value: '1',
                    data: {
                        'bag_id': '1'
                    }
                },
                {
                    value: '2',
                    data: {
                        'bag_id': '2'
                    }
                }
            ],
            bagId: {
                data: [
                    {
                        'bagId':1
                    },
                    {
                        'bagId':2
                    }
                ]
            }
                
            
        })
        wrapper.vm.unselectBags();
    })
    it('tests unselect bags not editing mode', () => {
        wrapper.setData({
            editingMode: false,
            bagList: [
                {
                    value: '1',
                    data: {
                        'bag_id': '1'
                    }
                },
                {
                    value: '2',
                    data: {
                        'bag_id': '2'
                    }
                }
            ],
            bagId: {
                data: [
                    {
                        'bagId':1
                    },
                    {
                        'bagId':2
                    }
                ]
            }
                
            
        })
        wrapper.vm.unselectBags();
    })
    it('tests unselect bags not editing mode with no shipments', () => {
        wrapper.setData({
            editingMode: false,
            shipmentId: {
                value: []
            },
            bagList: [
                {
                    value: '1',
                    data: {
                        'bag_id': '1'
                    }
                },
                {
                    value: '2',
                    data: {
                        'bag_id': '2'
                    }
                }
            ],
            bagId: {
                data: [
                    {
                        'bagId':1
                    },
                    {
                        'bagId':2
                    }
                ]
            }
                
            
        })
        wrapper.vm.unselectBags();
    })
})
