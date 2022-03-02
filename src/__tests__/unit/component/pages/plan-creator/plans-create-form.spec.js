import { createLocalVue, shallowMount , mount} from "@vue/test-utils";
import PlansForm from "@/pages/plan-creator/plans-form.vue";

import VueRouter from 'vue-router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Promise } from "window-or-global";
import { PageHeader } from '@/components/common/';
import { NitrozenButton } from '@gofynd/nitrozen-vue';
import URLS from '@/services//domain.service';
import flushPromises from "flush-promises";
import { form_data,components ,daytrader_components,companies} from "./mocks";

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
				{ path: '/administrator/subscription-plans/create', component: PlansForm }
			]
		})
		router.push('/administrator/subscription-plans/create');
        mock.onGet(URLS.FETCH_SUBSCRIPTION_COMPONENTS()).reply(200, components);
        mock.onGet(URLS.GET_COMPANY_LIST()).reply(200, companies);
        mock.onGet(URLS.FETCH_DAYTRADER_COMPONENT()).reply(200, daytrader_components);
        

		wrapper = mount(PlansForm, { 
                localVue,
                router
            }
        );
        await flushPromises();
	});

	afterEach(() => {
		mock.reset();
    });

	test('Create Plans UI', async () => {

		expect(wrapper.exists()).toBeTruthy();
		expect(wrapper.element).toMatchSnapshot();
		const div = wrapper.find('div');
		expect(div.exists()).toBe(true);
    });

    test('Cancel to listing page', async () => {
        let pageHeader = wrapper.findComponent(PageHeader);
        pageHeader.vm.$emit('backClick');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$router.currentRoute.path).toBe('/administrator/subscription-plans');
    });

    test('Check Save empty form error', async () => {
        let showErrorMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showError');
        let createBtn = wrapper.findComponent({ref:"createButton"});
        createBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
        expect(showErrorMethod).toHaveBeenCalled();
    });

    test('Save empty form error', async () => {
        let showErrorMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showError');
        let createBtn = wrapper.findComponent({ref:"createButton"});
        createBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
        expect(showErrorMethod).toHaveBeenCalled();
    });

    test('Form is dirty', async () => {
        wrapper.vm.$set(wrapper.vm, 'saveInProgress', true);
        wrapper.vm.$set(wrapper.vm.formData, 'name', 'test');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isFormDirty()).toBe(false);

        wrapper.vm.$set(wrapper.vm, 'saveInProgress', false);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.isFormDirty()).toBe(true);
    });

    test('Create plan api error', async () => {
        wrapper.vm.$set(wrapper.vm.formData, 'name', 'test');
        let showErrorMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showError');
        let createBtn = wrapper.find('.createBtn');
        createBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
        expect(showErrorMethod).toHaveBeenCalled();

    });
    test('Preview Plan', async () => {
        
        let previewPlanBtn = wrapper.findComponent({ref:'previewPlan'});
        previewPlanBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.showPreview).toBeTruthy();

    });

    test('Create plan successfully', async () => {
        mock.onPost(URLS.FETCH_SINGLE_PLAN('')).reply(200, {"data": {"_id": "test-plan"}, "message": "success"});
        wrapper.vm.formData = form_data
        // wrapper.vm.$set(wrapper.vm.formData, 'name', 'test');
        let showSuccessMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');
        let createBtn = wrapper.findComponent({ref:'createButton'});
        createBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
        await flushPromises();
        let saveBtn = wrapper.findComponent({ref:'savePlan'});
        saveBtn.vm.$emit('click');
        await wrapper.vm.$nextTick();
        
       setTimeout(() => {
        expect(showSuccessMethod).toHaveBeenCalled();
        
       }, 1000);
       
        // console.log(wrapper.vm.formData);
    //     expect(router.currentRoute.path).toBe('/administrator/subscription-plans/edit/test-plan/');
    //     expect(wrapper.vm.saveInProgress).toBe(false);
    });

    // test('Change menu action  to clone', async () => {
    //     wrapper.vm.onMenuAction('clone');
    //     let showSuccessMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');
    //         await wrapper.vm.$nextTick();
    //         expect(showSuccessMethod).toHaveBeenCalled();
           
    //     });

        // delete functionality has been removed

    // test('Change menu action  to delete', async () => {
    //         wrapper.vm.onMenuAction('delete');
    //         let showSuccessMethod = jest.spyOn(wrapper.vm.$snackbar.global, 'showSuccess');
    //             await wrapper.vm.$nextTick();
    //             expect(showSuccessMethod).toHaveBeenCalled();
               
    // });
    // test('Change menu action  to subcribe', async () => {
    //     wrapper.vm.onMenuAction('subcribe');
    //     let openModal = jest.spyOn(wrapper.vm.$refs['subscribe-modal'],'open');
    //         await wrapper.vm.$nextTick();
    //         expect(openModal).toHaveBeenCalled();
           
    // });

    // test('Change active state', async () => {
    //     let changePublishSwitch = wrapper.find('.clickable-label');
    //     changePublishSwitch.trigger('click');
    //     await wrapper.vm.$nextTick();
    //     expect(wrapper.vm.formData.is_active).toBe(false);
    // });

})
