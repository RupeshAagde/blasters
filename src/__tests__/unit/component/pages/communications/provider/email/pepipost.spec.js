'use strict';

import { mount, shallowMount, config, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ADMIN_URLS from '../../../../../../../services/domain.service';
import flushPromises from "flush-promises";
import ProvidersMock from '../../fixtures/providers.json'
import EventSubscriptionMock from '../../fixtures/providers.json'

import Pepipost from '../../../../../../../pages/communication/provider/email/pepipost.vue'
let localVue, wrapper, router;
const mock = new MockAdapter(axios);

describe('pepipost', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();

        router = new VueRouter({
            routes: [{
                path: '/administrator/communication/provider/:providerType/:mode/:providerId',
                component: Pepipost
            }]
        })
        router.push('/administrator/communication/provider/email/edit/62aaf4c8f878dd9cfcaedbf0?type=pepipost');
        wrapper = mount(Pepipost, {
            localVue,
            propsData: {
                isEditMode: true,
                id : '62aaf4c8f878dd9cfcaedbf0'
            },
            router,
        })

        mock.onGet(ADMIN_URLS.EMAIL_PROVIDER('62aaf4c8f878dd9cfcaedbf0')).reply(200, EventSubscriptionMock.email.pepipost);
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