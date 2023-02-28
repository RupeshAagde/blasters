'use strict';

/* Package imports */
import { createLocalVue, mount } from '@vue/test-utils';
import VueRouter from 'vue-router';
import { cloneDeep } from 'lodash';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import URLS from '@/services/domain.service';

/* Component imports */
import BulkActions from '@/pages/oms/bulk-actions/index.vue';

/* Mock inmports */
import BULK_ACTION_DATA from '@/__tests__/unit/component/pages/oms/fixtures/bulk-actions-data.json';
import BULK_DETAILS from '@/__tests__/unit/component/pages/oms/fixtures/bulk-details.json';

let localVue, wrapper, router;
const mock = new MockAdapter(axios);

const companyId = '3';
const params = {
    view: "bulk_action"
};

describe('Bulk Actions Page', () => {
    beforeEach(() => {
        /* Set up local environment for Vue */
        localVue = createLocalVue();
        localVue.use(VueRouter);

        /* Calling Mock API's */
        mock.reset();
        mock.onGet(URLS.FILTERS_V2(companyId, null, params)).reply(200, BULK_ACTION_DATA);
        mock.onGet(URLS.FETCH_BULK_LIST_DETAILED_DATA('564fba7a-cab0-42c8-9947-113aeb1de54f')).reply(200, BULK_DETAILS);

        /* Set up the vue router */
        router = new VueRouter({
            routes: [
                {
                    path: `/company/:companyID/orders/bulk`,
                    component: BulkActions
                },
            ],
        });
        router.push(`/company/1/orders/bulk`);

        /* Mount the component */
        wrapper = mount(BulkActions, {
            localVue,
            router,
            data() {
                return {
                    // advancedFilters: cloneDeep(BULK_ACTION_DATA),
                    advancedFilters: cloneDeep(BULK_ACTION_DATA.advance[0]),
                    alertMsg: '',
                    displayAlert: false,
                    displayAdvFilters: false,
                    displayDetails: false,
                    advancedSelectedFilters: {},
                    selectedDataDetails: BULK_ACTION_DATA,
                    globalFilters: cloneDeep(BULK_ACTION_DATA.global),
                    selectedFilters: {}
                };
            },
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });


    it('is a Vue instance', () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });


    it('should show an alert when download button is clicked', async () => {
        wrapper.setData({
            displayAlert: false
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.findComponent({
            ref: 'bulk-upload-download',
        });

        copyClick.vm.$emit(
            'showAlert',
            'Template file is loading and will download upon completion.'
        );

        await wrapper.vm.$nextTick();
        
        expect(wrapper.vm.displayAlert).toBe(true);
    });


    it('should show an alert when the copy button is clicked', async () => {
        wrapper.setData({
            displayAlert: false
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const copyClick = wrapper.findComponent({
            ref: 'bulk-upload-download',
        });
        copyClick.vm.$emit('showAlert', false);

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.displayAlert).toBe(false);
    });

    it('should show an alert when download button is clicked', async () => {
        let filterFuntionOnRef = jest.spyOn(wrapper.vm, 'callInvoiceListApi');

        const copyClick = wrapper.findComponent({
            ref: 'bulk-upload-download',
        });

        copyClick.vm.$emit(
            'makeFetchInvoiceList',
            true
        );

        await wrapper.vm.$nextTick();
        
        expect(filterFuntionOnRef).toHaveBeenCalled();
    });


    it(`should call applyFilters method when the 'Apply' is clicked`, async () => {
        let filterFuntionOnRef = jest.spyOn(wrapper.vm, 'applyFilters');
        wrapper.setData({
            displayAdvFilters: true
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const applyBtn = wrapper.find('.apply-filter-button');
        applyBtn.trigger('click');

        await wrapper.vm.$nextTick();

        expect(filterFuntionOnRef).toHaveBeenCalled();
    });


    it('should close the side drawer if a close drawer method is emitted with a valid array', async () => {
        let closeFunction = jest.spyOn(wrapper.vm, 'resetFilters');

        wrapper.setData({
            displayAdvFilters: true,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        
        const advFilterComponent = wrapper.find('.clear-button');
        advFilterComponent.vm.$emit('click');

        await wrapper.vm.$nextTick();

        expect(closeFunction).toHaveBeenCalled();
    });


    it('should show the advanced filters for download when the advanced filter button is clicked', async()=>{
        wrapper.setData({
            displayAdvFilters: false,
        });

        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();

        const BulkUploadComponent = wrapper.findComponent({ref:'bulk-upload-download'});
        BulkUploadComponent.vm.$emit('showAdvFilters');

        await wrapper.vm.$nextTick();

        expect(wrapper.vm.displayAdvFilters).toBe(true);
    });


    it('should show the details of a card when it is clicked', async ()=>{
        const BulkListComponent = wrapper.findComponent({
            ref:"bulk-list"
        });

        BulkListComponent.vm.$emit('click', '564fba7a-cab0-42c8-9947-113aeb1de54f');

        await wrapper.vm.$nextTick();
        expect(wrapper.vm.displayDetails).toBe(false);
    });
});
