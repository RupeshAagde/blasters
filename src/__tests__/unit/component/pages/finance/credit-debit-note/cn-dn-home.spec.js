'use strict';

import { shallowMount, createLocalVue } from "@vue/test-utils";
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from '@/services/domain.service';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import CreditHomeVue from '../../../../../../../src/pages/finance/credit-debit-note/cn-dn-home.vue';
import USER_MOCK from './fixtures/user-mock.json';
import INITIAL_PAYLOAD_MOCK from './fixtures/initial-payload.json';
import NOTE_DETAIL_MOCK from './fixtures/note-detail.json';
import CreditNoteVue from '../../../../../../../src/pages/finance/credit-debit-note/create-cn-dn.vue';

let wrapper, router, localVue;
const mock = new MockAdapter(axios);

let note_item = {
    "approved_at": null,
    "category": "gst_fee",
    "created_at": "2022-06-14 19:03:22",
    "document_number": "test_document",
    "id": "cc3ab88e-4338-48b5-9a73-ad35aeeb5a0b",
    "seller_name": "ABC1 Seller",
    "status": "Init",
    "total_amount": 123.4
}

describe('credit-debit-note home page', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        router = new VueRouter({
            routes: [
                {
                    path: 'finance/credit-debit-note',
                    component: CreditHomeVue,
                },
                {
                    name: 'credit-note',
                    path: 'finance/credit-debit-note/credit-note/:noteType/:noteId?/:preview?/:isApprover?/:documentNo?',
                    component: CreditNoteVue,
                },
            ],
        });

        mock.onPost(URLS.GET_LIST_DATA()).reply(200, INITIAL_PAYLOAD_MOCK);

        wrapper = shallowMount(CreditHomeVue, {
            localVue,
            router,
            computed: {
                userData: () => {
                    return USER_MOCK.computedFix;
                },
                currentUserPermissions: () => {
                    return USER_MOCK.computedFix.user
                }
            },
            data: function() {
                return {
                    noteTypeValue: 'commercial',
                    tab: {
                        approved_at: "2022-07-12 03:58:58",
                        category: "gst_fee",
                        created_at: "2022-07-11 15:14:08",
                        document_number: "3PCN14231000026",
                        id: "778fafeb-4c22-440c-ae21-74064d1bb797",
                        seller_name: "dummy seller name",
                        status: "approved",
                        total_amount: 354
                    }
                }
            }
        })
        await flushPromises();
    })

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('is a Vue instance', () => {
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('should delete a note', async() => {
        mock.onPost(URLS.GET_NOTE_DATA()).reply(200, NOTE_DETAIL_MOCK);
        mock.onPost(URLS.GET_ENTITY()).reply(200, {
            "success": true,
            "reason": "Request Successful"
        });
        wrapper.vm.deleteNote(note_item);
    })
    
    it('should change filter type', () => {
        wrapper.vm.changeFilterType();
    })

    /* it('should change note type', () => {
        wrapper.vm.changeNoteType();
    }) */

    it('should auto search in note', () => {
        wrapper.vm.autoSearchNote();
    })

    it('auto search status', async() => {
        const getListfn = jest.spyOn(wrapper.vm, 'getListData');
        wrapper.setData({
            filterType: 'Recon'
        })
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const statusDD = wrapper.find('#search-status');
        statusDD.vm.$emit('change');
        expect(getListfn).toHaveBeenCalled();
    })

    /* it('date picker', async() => {
        const getListfn = jest.spyOn(wrapper.vm, 'dateRangeChange');
        wrapper.setData({
            reconDate: ['1669372339','1669372188'],
        })
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const statusDD = wrapper.find('.date-picker');
        statusDD.vm.$emit('input');
        expect(getListfn).toHaveBeenCalled();
    }) */

    it('handles page changes', () => {
        wrapper.vm.handlePageChanges({});
    })

    it('date picker', async() => {
        wrapper.setData({
            reconDate: ['1669372339','1669372188'],
        });
        wrapper.vm.dateRangeChange();
    })

    // it('should go to edit screen', () => {
    //     //wrapper.vm.routeNoteCheck();
    //     let routerPushMethod = jest.spyOn(wrapper.vm.$router, 'push');

    //     let element = wrapper.find('.icon-edit');
    //     element.trigger('click');

    //     expect(routerPushMethod).toHaveBeenCalled();
    // })

    /* it('tests select row function', () => {
        wrapper.vm.select({});
    }) */

    it('tests search by input function', () => {
        wrapper.setData({
            filterTypeList: [
                {
                    text: 'aaa',
                    value: 'aaa'
                }
            ]
        });
        wrapper.vm.searchStatus({text: 'aaa'});
        wrapper.vm.autoSearchNote();  
    })

    it('Search with debounce', async() => {
        //wrapper.vm.getDates();
        wrapper.setData({
            noteTypeItems: [
                {
                    text: 'aaa',
                    value: 'aaa'
                }
            ]
        })
        wrapper.vm.changeNoteType({text: 'aaa'});
        wrapper.vm.searchByInput({});
        await new Promise(resolve => setTimeout(resolve, 1000));
    });


    it('opens approve drawer',() => {
        wrapper.vm.quickApproverViewSection('approve');
    })

    it('opens in preview mode', () => {
        wrapper.vm.previewNote({
            approved_at: "2022-07-12 03:58:58",
            category: "gst_fee",
            created_at: "2022-07-11 15:14:08",
            document_number: "3PCN14231000026",
            id: "778fafeb-4c22-440c-ae21-74064d1bb797",
            seller_name: "dummy seller name",
            status: "approved",
            total_amount: 354
        });
    })

    it('opens in edit mode', () => {
        wrapper.vm.editNote({
            approved_at: "2022-07-12 03:58:58",
            category: "gst_fee",
            created_at: "2022-07-11 15:14:08",
            document_number: "3PCN14231000026",
            id: "778fafeb-4c22-440c-ae21-74064d1bb797",
            seller_name: "dummy seller name",
            status: "approved",
            total_amount: 354
        });
    })

    it('navigates to new component', () => {
        wrapper.vm.routeNoteCheck();
    });

    it('update drawer data', async() => {
        wrapper.setData({
            tab: ['22']
        })
        wrapper.vm.updateDrawerData({},true);
        wrapper.vm.updateDrawerData({},false);
        wrapper.vm.select({ document_number: '2323' });
    });

    it('downloads note', () => {
        mock.onPost(URLS.DOWNLOAD_NOTE()).reply(200, {
            "data":{
                "success": true,
                "url": "Test url"
            }
        });
        wrapper.vm.downloadNote({
            id: 'dummy id'
        });
    })


})
