'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '../../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import ProvidersMock from '../../fixtures/providers.json'
import EventSubscriptionMock from '../../fixtures/providers.json'

import Falconide from '../../../../../../../pages/communication/provider/email/falconide.vue'
let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('falconide', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();

        router = new VueRouter({
            routes: [{
                path: '/administrator/communication/provider/:providerType/:mode/:providerId',
                component: Falconide
            }]
        })
        router.push('/administrator/communication/provider/email/edit/62a70f8671fbbca9de311362?type=falconide');
        wrapper = mount(Falconide, {
            localVue,
            propsData: {
                isEditMode: true,
                id : '62a70f8671fbbca9de311362'
            },
            router,
        })

        mock.onGet(ADMIN_URLS.EMAIL_PROVIDER('62a70f8671fbbca9de311362')).reply(200, EventSubscriptionMock.email.falconide);
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





})