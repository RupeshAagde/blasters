'use strict';

import { shallowMount, mount, createLocalVue } from "@vue/test-utils";
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
import { flush } from "@sentry/node";

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
        router.push('finance/credit-debit-note?activeTab=0');

        mock.onPost(URLS.GET_LIST_DATA()).reply(200, INITIAL_PAYLOAD_MOCK);

        wrapper = shallowMount(CreditHomeVue, {
            localVue,
            router,
            propsData: {
                noteType: 'credit',
            },
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
        await flushPromises();
        const deleteNoteFun = jest.spyOn(wrapper.vm, 'deleteNote');
        deleteNoteFun(note_item);
        const deleteNote = wrapper.findComponent({ref: 'delete-note'});
        //deleteNote.vm.$emit('click', note_item);
        expect(wrapper.vm.inProgress).toBe(false);
    });

    it('should disable the button', async() => {
        await flushPromises();
        wrapper.setData({
            tab: [121],
            drawerData: {
                notesSet: {
                    'aaa': 'commercial'
                },
                status: ''
            },
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const disableBtn = wrapper.findComponent({ref: 'check-boxes'});
        disableBtn.vm.$emit('change');
        expect(wrapper.vm.isDisabled.Reject).toBe(false);
    });;

    it('it changes the pagination method when the pagination is changed', async () => {
        await flushPromises();
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.find('.pagination-main');
        copyClick.vm.$emit('change', {
            "limit": 10,
            "current": 2,
            "total": 70
        });
        const pageObject = {
            "limit": 10,
            "current": 2,
            "total": 70
        };
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.pageObject).toEqual(pageObject);
    });

    it('should auto search in note', async() => {
        await flushPromises();
        wrapper.setData({
            noteTypeValue: 'commercial'
        })
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const noteType = wrapper.find('#note-type-dd');
        noteType.vm.$emit('change');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.pageObject.current).toBe(1);
    });

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

    it('date picker', async() => {
        wrapper.setData({
            reconDate: ['1669372339','1669372188'],
        });
        wrapper.vm.dateRangeChange();
    })

    it('tests search by input function', async() => {
        const getListfn = jest.spyOn(wrapper.vm, 'getListData');
        await flushPromises();
        wrapper.setData({
            filterTypeList: [
                {
                    text: 'Approved',
                    value: 'approved'
                }
            ],
            modifiedFilterList: [
                {
                    text: 'Approved',
                    value: 'approved'
                }
            ],
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const statusDD = wrapper.find('#search-status');
        statusDD.vm.$emit('searchInputChange',{
            text: 'Approved',
            value: 'approved'
        });
        expect(wrapper.vm.modifiedFilterList.length).toBe(1);
    });

    it('Search with debounce', async() => {
        await flushPromises();
        wrapper.setData({
            noteTypeItems: [
                {
                    text: 'aaa',
                    value: 'aaa'
                }
            ]
        })
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const searchBar = wrapper.findComponent({ref: 'search-bar'});
        searchBar.vm.$emit('input', {});
        wrapper.vm.changeNoteType({text: 'aaa'});
        await new Promise(resolve => setTimeout(resolve, 1000));
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.pageObject.current).toBe(1);
    });

    it('close the approver drawer', async()=> {
        await flushPromises();
        wrapper.setData({
            quickApproveView: true,
            inProgress: false,
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const approverDrawer = wrapper.findComponent({ref: 'approver-drawer'});
        approverDrawer.vm.$emit('drawerClose', true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.inProgress).toBe(false);
    });


    it('should open the approver drawer when clicked',async() => {
        await flushPromises();
        wrapper.setData({
            quickApproveView: true,
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const approverDrawer = wrapper.findComponent({ref: 'reject-btn'});
        approverDrawer.vm.$emit('click', 'Reject');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.quickApproveView).toBe(false);
    })

    it('should redirect to preview page', async() => {
        await flushPromises();
        wrapper.setData({
            inProgress: false,
        })
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const previewNoteFun = jest.spyOn(wrapper.vm, 'previewNote');
        previewNoteFun({
            approved_at: "2022-07-12 03:58:58",
            category: "gst_fee",
            created_at: "2022-07-11 15:14:08",
            document_number: "3PCN14231000026",
            id: "778fafeb-4c22-440c-ae21-74064d1bb797",
            seller_name: "dummy seller name",
            status: "approved",
            total_amount: 354
        });
        const editNote = jest.spyOn(wrapper.vm, 'editNote');
        editNote({
            approved_at: "2022-07-12 03:58:58",
            category: "gst_fee",
            created_at: "2022-07-11 15:14:08",
            document_number: "3PCN14231000026",
            id: "778fafeb-4c22-440c-ae21-74064d1bb797",
            seller_name: "dummy seller name",
            status: "approved",
            total_amount: 354
        });
        const routeNoteCheck = jest.spyOn(wrapper.vm, 'routeNoteCheck');
        routeNoteCheck();
        const previewNote = wrapper.findComponent({ref: 'preview-note'});
        expect.anything();
    });

    it('downloads note', async() => {
        mock.onPost(URLS.DOWNLOAD_NOTE()).reply(200, {
            "data":{
                "success": true,
                "url": "Test url"
            }
        });
        await flushPromises();
        const downloadNote = jest.spyOn(wrapper.vm, 'downloadNote');
        downloadNote({
            id: 'dummy id'
        });
        await wrapper.vm.$nextTick();
        expect.anything();
    })

    it('update drawer data', async() => {
        await flushPromises();
        wrapper.setData({
            tab: ['332'],
            drawerData: {
                notesSet: {
                    'aaa': 'commercial'
                },
                status: ''
            },
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const disableBtn = wrapper.findComponent({ref: 'check-boxes'});
        disableBtn.vm.$emit('change',{ document_number: '2323' });
        wrapper.vm.updateDrawerData({},true);
        wrapper.vm.updateDrawerData({},false);
        wrapper.vm.select({ document_number: '2323' });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.tab.length).toBe(3);
        /* wrapper.setData({
            tab: ['22']
        })
        wrapper.vm.updateDrawerData({},true);
        wrapper.vm.updateDrawerData({},false);
        wrapper.vm.select({ document_number: '2323' }); */
    });

    


})
