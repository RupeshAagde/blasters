'use strict';

import { shallowMount, createLocalVue } from "@vue/test-utils";
import ApproverDrawer from '@/pages/finance/credit-debit-note/approver-drawer.vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from '@/services/domain.service';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';
import { NitrozenButton } from '@gofynd/nitrozen-vue';

let wrapper, router, localVue;
const mock = new MockAdapter(axios);

describe('approver drawer', () => {
    beforeEach(()=>{
        wrapper = shallowMount(ApproverDrawer,{
            props:{
                notesSet: {
                    type: Object,
                    default: () => {
                        return {
                            "commercial":[{
                                "sellerName":"sss",
                            }]
                        };
                      }
                },
                status: {
                    type: String,
                    default: () => {
                        return "Approve";
                      }
                }
            },
            data: function() {
                return {
                    commentsSet:[],
                    tabs:["commercial"],
                    currInd:0,
                    newStatus:'',
                    totalCount:5
                 }
            },
            mocks:{
                $router: {
                    params: {},
                    back:() => {}
                },
                $route: {
                    path: '/administrator/finance/credit-debit-note'
                }
            },
        });
    })

    it('is a Vue instance', () => {
        expect(wrapper.vm).toBeTruthy()
    })
    it('has data', () => {
        expect(typeof ApproverDrawer.data).toBe('function');
    })
    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot()
    })
    it('div expect', () => {
        const div = wrapper.find('div')
        expect(div.exists()).toBe(true)
    })
    // it('stops click',() => {
    //     wrapper.vm.stopClick(this.event);
    // })
    it('approves or rejects request',async() => {
        let params = {
            data: {
                note_id: 'dummy note id',
                status: 'approved',
                remark: 'dummy remark',
            }
        };

        mock.onPost(URLS.UPDATE_NOTE_STATUS(params)).reply(200, 
            {"success": true,
            "reason": "Requested note updated in system"
        });
        wrapper.vm.getApprove({
            noteId: 'dummy note id',
            comment: 'dummy remark',
        });
    })
    it('approves or rejects request without proper param',async() => {
        let params = {
            data: {
                status: 'approved',
                remark: 'dummy remark',
            }
        };

        mock.onPost(URLS.UPDATE_NOTE_STATUS(params)).reply(400, 
            {"success": false,
            "reason": "Requested note not updated in system"
        });
        wrapper.vm.getApprove({
                noteId: 'dummy note id',
                comment: 'dummy remark',
                is_checked: true,
                errorMessage : "",
                isValid: true
        });
    })
    // it('closes drawer', () => {
    //     let element = wrapper.find('.clear-button');
    //     element.vm.$emit('close');
    //     console.log('dgjhgjgerfgre',wrapper)
    //     expect(wrapper.emitted()['close']).toBeTruthy();
    // })
    it('get tabs', () => {
        wrapper.vm.getTabs();
    })
    it('changeGroupIndex', () => {
        wrapper.vm.changeGroupIndex({
            index:2
        });
    })
    it('unselecting tab', () => {
        wrapper.vm.unSelect({
            noteId: 'dummy note id',
            comment: 'dummy remark',
            is_checked: true,
            errorMessage: "",
            isValid: true
        });
    })
    it('selecting tab', () => {
        wrapper.vm.select(1,{
                noteId: 'dummy note id',
                comment: '',
                is_checked: false,
                errorMessage: "",
                isValid: true
            }
        );
    })
    it('validates form', () => {
        wrapper.vm.validateForm(1,{
                noteId: 'dummy note id',
                comment: 'dummy remark',
                is_checked: true,
                errorMessage: "",
                isValid: true
            }
        );
    })
    it('validates form with empty comment', () => {
        wrapper.vm.validateForm(1,{
                noteId: 'dummy note id',
                comment: '',
                is_checked: false,
                errorMessage: "",
                isValid: true
            }
        );
    })
    it('tests disable save', () => {
        wrapper.vm.disableSave();
    })
    it('tests get approval all ', () => {
        wrapper.vm.getApproveAll();
    })
})

