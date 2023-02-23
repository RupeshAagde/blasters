'use strict';

import {mount,createLocalVue} from "@vue/test-utils";
import globalVariables from "./../../../../../pages/communication/global-variables.vue";
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import axios from 'axios';
import URLS from "./../../../../../services/domain.service"
import CommsRoutes from './../../../../../router/index.js';
import MOCK_DATA from "./fixtures/global-variables.json";
import flushPromises from "flush-promises";
import cloneDeep from 'lodash/cloneDeep';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);


describe('global-variables testcases', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        mock.onGet(URLS.GLOBAL_VARIABLES()).reply(200, MOCK_DATA.data);
        mock.onPost(URLS.GLOBAL_VARIABLES()).reply(200);
        router = new VueRouter({
            routes:cloneDeep(CommsRoutes)
        })
        router.push('/administrator/communication/global-variables');
        wrapper = mount( globalVariables , {
            localVue,
            router,
        })
        await flushPromises();
    });
    it('exists wrapper and div', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.element).toMatchSnapshot();
    })
    it('gets global-variables',async () => {
        expect(wrapper.vm.read_only).toBeTruthy()
        expect(wrapper.vm.from_address.value).toBeTruthy()
    })
    it('saves global-variables',async () => {
        let snackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess')
        wrapper.vm.save()
        await flushPromises()
        expect(snackbar).toHaveBeenCalled()
        
    })
    it('deletes global-variables',async () => {
        let snackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');
        wrapper.vm.save(true)
        await flushPromises()
        wrapper.vm.$refs["confirm_delete_payout"].$emit("close");
        expect(snackbar).toHaveBeenCalled()
    })
    // fit('copies to clipboard',async () => {
    //     // let snackbar = jest.spyOn(wrapper.vm.$snackbar.global, 'showInfo')
    //     // wrapper.vm.copyToClipboard('',wrapper.emitted())
    //     // await flushPromises()
    //     // expect(snackbar).toHaveBeenCalled()
    // })
})