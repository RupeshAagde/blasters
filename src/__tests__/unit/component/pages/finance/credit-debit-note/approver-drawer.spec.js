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
                noteId: {
                type: String
                },
                sellerName: {
                    type: String
                },
                requestNo: {
                type: String
                },
                status: {
                    type: String
                },
                grossAmount: {
                    type: String
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
        wrapper.vm.getApprove();
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
        wrapper.vm.getApprove();
    })
    // it('closes drawer', () => {
    //     let element = wrapper.find('.clear-button');
    //     element.vm.$emit('close');
    //     console.log('dgjhgjgerfgre',wrapper)
    //     expect(wrapper.emitted()['close']).toBeTruthy();
    // })
    it('validates form', () => {
        wrapper.vm.validateForm();
    })
    it('tests disable save', () => {
        wrapper.vm.disableSave();
    })
})
