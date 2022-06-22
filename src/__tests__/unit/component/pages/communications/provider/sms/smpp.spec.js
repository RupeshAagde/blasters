'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '../../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import ProvidersMock from '../../fixtures/providers.json'
import EventSubscriptionMock from '../../fixtures/providers.json'

import Smpp from '../../../../../../../pages/communication/provider/sms/smpp.vue'
let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('smpp', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();

        router = new VueRouter({
            routes: [{
                path: '/administrator/communication/provider/:providerType/:mode/:providerId',
                component: Smpp             

            }]
        })
        router.push('/administrator/communication/provider/sms/edit/62a315b12738e22c77ca9932?type=smpp');
        wrapper = mount(Smpp     
            , {
            localVue,
            propsData: {
                isEditMode: true,
                id : '62a315b12738e22c77ca9932'
            },
            router,
        })

        mock.onGet(ADMIN_URLS.SMS_PROVIDER('62a315b12738e22c77ca9932')).reply(200, EventSubscriptionMock.sms.smpp);
        await flushPromises();



    });
    it('exists wrapper and div', async () => {

        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
         //wrapper.vm.addMoreFrom();

    })
    
    it('Save form' , async()=>{
        wrapper.vm.data.name.value = "testing"
        let data = wrapper.vm.validateAndSaveForm()
        expect(data.name).toBe("testing")
    });





})