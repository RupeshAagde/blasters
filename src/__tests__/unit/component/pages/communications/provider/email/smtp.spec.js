'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '../../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import ProvidersMock from '../../fixtures/providers.json'
import EventSubscriptionMock from '../../fixtures/providers.json'

import Smtp
 from '../../../../../../../pages/communication/provider/email/smtp.vue'
let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('smtp', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();

        router = new VueRouter({
            routes: [{
                path: '/administrator/communication/provider/:providerType/:mode/:providerId',
                component: Smtp

            }]
        })
        router.push('/administrator/communication/provider/email/edit/62a311ea2738e23ed0ca9931?type=smtp');
        wrapper = mount(Smtp
            , {
            localVue,
            propsData: {
                isEditMode: true,
                id : '62a311ea2738e23ed0ca9931'
            },
            router,
        })

        mock.onGet(ADMIN_URLS.EMAIL_PROVIDER('62a311ea2738e23ed0ca9931')).reply(200, EventSubscriptionMock.email.smtp);
        await flushPromises();



    });
    it('exists wrapper and div', async () => {

        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
         wrapper.vm.addMoreFrom();

    })
    
    it('Save form' , async()=>{
        wrapper.vm.data.name.value = "testing"
        let data = wrapper.vm.validateAndSaveForm()
        expect(data.name).toBe("testing")
    });

    it('makes email form default', async()=>{
        wrapper.vm.data.from_address = EventSubscriptionMock.email.from_address
        wrapper.vm.makeFromDefault(1)
        expect(wrapper.vm.data.from_address.value[1].is_default).toBeTruthy()
    })



})