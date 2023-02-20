'use strict';

/* Package imports */
import { createLocalVue, shallowMount } from "@vue/test-utils";
import axios from 'axios';
import flushPromises from 'flush-promises';
import MockAdapter from 'axios-mock-adapter';
import VueRouter from "vue-router";

/* Component imports */
import BulkActionsIndex from '@/pages/oms/bulk-actions/index.vue';

/* Services imports */
import URLS from '@/services/domain.service';

/* Mock imports */
import BULK_ACTIONS_FILTERS from '@/__tests__/unit/component/pages/oms/fixtures/bulk-actions-filters.json';


let wrapper, router, localVue;
const mock = new MockAdapter(axios);

describe('Bulk Actions Index Page', () => {
    beforeEach(async() => {
        /* Create localVue instance */
        localVue = createLocalVue();

        /* Calling mock APIs */
        mock.reset();
        mock.onGet(
            URLS.FILTERS_V2(null, null, {view: 'bulk-action'})
        ).reply(200, BULK_ACTIONS_FILTERS);

        /* Set up vue router */
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/bulk', component: BulkActionsIndex }
            ]
        });
        router.push(`/orders/bulk`);

        /* Mount the component */
        wrapper = shallowMount(
            BulkActionsIndex, 
            {
                localVue,
                router
            }
        )
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('is a Vue instance', () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('should show an alert when download button is clicked', async() => {
        await flushPromises();

        wrapper = shallowMount(
            BulkActionsIndex, 
            { 
                localVue, 
                router,
                data() {
                    return {
                        displayAlert: false
                    }
                }
            }
        );


        // await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        console.log(wrapper.vm.globalFilters);

        // const bulkUploadDownloadComponent = wrapper.findComponent({
        //     ref: 'bulk-upload-download',
        // });

        // console.log("component:  ", bulkUploadDownloadComponent);

        // bulkUploadDownloadComponent.vm.$emit('showAlert');

        // copyClick.vm.$emit(
        //     'showAlert',
        //     'Template file is loading and will download upon completion.'
        // );

        // await wrapper.vm.$nextTick();
        
        // expect(wrapper.vm.displayAlert).toBe(true);
        expect(1+1).toBe(3);
    });
})
