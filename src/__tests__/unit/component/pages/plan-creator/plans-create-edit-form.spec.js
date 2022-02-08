import { createLocalVue, shallowMount } from "@vue/test-utils";
import PlansForm from "@/pages/plan-creator/plans-form.vue";

import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { plan_list_res } from './mocks'
import { PageHeader } from '@/components/common/'
import URLS from '@/services//domain.service';
import flushPromises from "flush-promises";

describe('Plans create form', () => {
	let wrapper;
    let localVue;
    let router;
    const mock = new MockAdapter(axios);

	beforeEach(async () => {
        
		localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
			routes: [
				{ path: '/administrator/subscription-plans/edit/:planId', component: PlansForm }
			]
		})
        router.push('/administrator/subscription-plans/edit/test-plan');
        
        mock.onGet(URLS.FETCH_SINGLE_PLAN('test-plan')).reply(function(config){
            if(config.url.includes('test-plan')) {
                return [200, {
                    "_id": "test-plan",
                    ...plan_list_res.docs[0]
                }]
            }
        });

		wrapper = shallowMount(PlansForm, {
                localVue,
                router
            }
        );
        await flushPromises();
	});

	afterEach(() => {
		mock.reset();
    });

	test('Edit Plans UI', async () => {

		expect(wrapper.exists()).toBeTruthy();
		expect(wrapper.element).toMatchSnapshot();
		const div = wrapper.find('div');
		expect(div.exists()).toBe(true);
    });

    test('Edit plan initial api error', async () => {
        mock.onGet(URLS.FETCH_SINGLE_PLAN('test-plan')).reply(400, {message: "error occured(test)"});
        wrapper = shallowMount(PlansForm, {
                localVue,
                router
            }
        );
        let showErrorMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showError');
        await wrapper.vm.$nextTick();
        await flushPromises();
        expect(showErrorMethod).toHaveBeenCalled();
    });

    test('Edit plan api error', async () => {
        mock.onPut(URLS.FETCH_PLANS_LIST('test-plan')).reply(400, {message: "error occured(test)"});
        let showErrorMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showError');
        let createBtn = wrapper.find('.createBtn');
        createBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
        await flushPromises();
        expect(showErrorMethod).toHaveBeenCalled();
    });

    // test('Edit plan successfully', async () => {
    //     mock.onPut(URLS.FETCH_PLANS_LIST('test-plan')).reply(200, {"data": {"_id": "test-plan", "name": "teest2"}, "message": "success"});
    //     wrapper.vm.$set(wrapper.vm.formData, 'name', 'test2');
    //     let showSuccessMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');cc
    //     let createBtn = wrapper.find('.createBtn');
    //     createBtn.vm.$emit('click');
    //     await wrapper.vm.$nextTick();
    //     await flushPromises();
    //     expect(showSuccessMethod).toHaveBeenCalled();
    //     expect(router.currentRoute.fullPath).toBe('/administrator/subscription-plans/edit/test-plan');
    //     expect(wrapper.vm.saveInProgress).toBe(false);
    // });

    test('Clone plan', async () => {
        let showSuccessMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');
        let pageHeader = wrapper.findComponent(PageHeader);
        pageHeader.vm.$emit('clone');
        await wrapper.vm.$nextTick();
        await flushPromises();
        expect(showSuccessMethod).toHaveBeenCalled();
        expect(router.currentRoute.fullPath).toBe('/administrator/subscription-plans/edit/test-plan?clone=true');
    });

})
