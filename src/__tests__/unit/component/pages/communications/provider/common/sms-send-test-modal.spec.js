'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import CommsRoutes from '../../../../../../../router/index.js';
import sendModal from '../../../../../../../pages/communication/provider/common/sms-send-test-modal.vue'
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '../../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import ProvidersMock from '../../fixtures/providers.json'
import cloneDeep from 'lodash/cloneDeep';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('send test sms modal testcases', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(ADMIN_URLS.SMS_PROVIDER(`62a318fa2738e2ee8aca9933`)).reply(200,ProvidersMock.sms.telspiel);
        mock.onPost(ADMIN_URLS.COMMUNICATION_SEND_SYNC()).reply(200);
        router = new VueRouter({
            routes:cloneDeep(CommsRoutes)
        })
        router.push('/administrator/communication/provider/sms/edit/62a318fa2738e2ee8aca9933?type=telspiel');
        wrapper = shallowMount( sendModal , {
            localVue,
            router,
            propsData:{
                provider:'62a318fa2738e2ee8aca9933'
            }
        })
        await flushPromises()
    });
    it('snapshot', async () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    it('successfully sends test sms with valid sms',async () => {
        wrapper.vm.testSms = ProvidersMock['testSms'].validData
        wrapper.vm.sendSms()
        await flushPromises()
        expect(wrapper.vm.smsSuccessfullySent).toBeTruthy()
    })
    it('error in sending test sms with valid sms',async () => {
        wrapper.vm.testSms = ProvidersMock['testSms'].validData
        wrapper.vm.sendSms()
        mock.onPost(ADMIN_URLS.COMMUNICATION_SEND_SYNC()).reply(500)
        await flushPromises()
        expect(wrapper.vm.failedToSend).toBeTruthy()
    })
    it('tries to send test sms with invalid sms',async () => {
        wrapper.vm.testSms = ProvidersMock['testSms'].invalidData
        wrapper.vm.sendSms()
        expect(wrapper.vm.testSms.phone_number.showerror).toBeTruthy()
    })
    it('edits provider',async ()=>{
        let routerPushMethod = jest.spyOn(wrapper.vm.$router, 'push');
        wrapper.vm.editProvider()
        await flushPromises()
        expect(routerPushMethod).toHaveBeenCalled()
    })
})