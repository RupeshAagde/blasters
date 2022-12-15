'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '../../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import ProvidersMock from '../../fixtures/providers.json'
import EventSubscriptionMock from '../../fixtures/providers.json'

import Timesinternet from '../../../../../../../pages/communication/provider/sms/timesinternet.vue'
let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('timesinternet', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();

        router = new VueRouter({
            routes: [{
                path: '/administrator/communication/provider/:providerType/:mode/:providerId',
                component: Timesinternet             

            }]
        })
        router.push('/administrator/communication/provider/sms/edit/62a319722738e246ffca9934?type=timesinternet');
        wrapper = mount(Timesinternet     
            , {
            localVue,
            propsData: {
                isEditMode: true,
                id : '62a319722738e246ffca9934'
            },
            router,
        })

        mock.onGet(ADMIN_URLS.SMS_PROVIDER('62a319722738e246ffca9934')).reply(200, EventSubscriptionMock.sms.timesinternet);
        await flushPromises();



    });
    it('exists wrapper and div', async () => {

        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
    })
    
    it('Save form' , async()=>{
        wrapper.vm.data.name.value = "testing"
        let data = wrapper.vm.validateAndSaveForm()
        expect(data.name).toBe("testing")
    });





})