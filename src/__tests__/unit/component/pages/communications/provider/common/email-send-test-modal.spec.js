'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import CommsRoutes from '../../../../../../../router/index.js';
import sendModal from '../../../../../../../pages/communication/provider/common/email-send-test-modal.vue'
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '../../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import ProvidersMock from '../../fixtures/providers.json'
import cloneDeep from 'lodash/cloneDeep';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('send test email modal testcases', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(ADMIN_URLS.EMAIL_PROVIDER(`62a70f8671fbbca9de311362`)).reply(200,ProvidersMock.email.falconide);
        mock.onPost(ADMIN_URLS.COMMUNICATION_SEND_SYNC()).reply(200);
        router = new VueRouter({
            routes:cloneDeep(CommsRoutes)
        })
        router.push('/administrator/communication/provider/email/edit/62a70f8671fbbca9de311362?type=falconide');
        wrapper = shallowMount( sendModal , {
            localVue,
            router,
            propsData:{
                provider:'62a70f8671fbbca9de311362'
            }
        })
        await flushPromises()
    });
    it('snapshot', async () => {
        expect(wrapper.element).toMatchSnapshot();
    });
    it('successfully sends test email with valid email',async () => {
        wrapper.vm.testEmail = ProvidersMock['testEmail'].validData
        wrapper.vm.sendEmail()
        await flushPromises()
        expect(wrapper.vm.emailSuccessfullySent).toBeTruthy()
    })
    it('error in sending test email with valid email',async () => {
        wrapper.vm.testEmail = ProvidersMock['testEmail'].validData
        wrapper.vm.sendEmail()
        mock.onPost(ADMIN_URLS.COMMUNICATION_SEND_SYNC()).reply(500)
        await flushPromises()
        expect(wrapper.vm.failedToSend).toBeTruthy()
    })
    it('tries to send test email with invalid email',async () => {
        wrapper.vm.testEmail = ProvidersMock['testEmail'].invalidData
        wrapper.vm.sendEmail()
        expect(wrapper.vm.testEmail.to.showerror).toBeTruthy()
    })
    it('edits provider',async ()=>{
        let routerPushMethod = jest.spyOn(wrapper.vm.$router, 'push');
        wrapper.vm.editProvider()
        await flushPromises()
        expect(routerPushMethod).toHaveBeenCalled()
    })
})