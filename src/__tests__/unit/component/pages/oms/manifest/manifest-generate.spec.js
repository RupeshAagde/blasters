'use strict';

/* Package imports */
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

/* Component imports */
import GenerateManifestPage from '@/pages/oms/manifest/manifest-generate.vue';
import admpageheader from '@/components/common/layout/adm-page-header.vue';
import ManifestHomePage from '@/pages/oms/manifest/index.vue';

/* Mock imports */
import MANIFEST_FILTERS_MOCK from '../fixtures/manifest/manifest-filter.json';
import MANIFEST_FULLFILMENT_FILTER_MOCK from '../fixtures/manifest/manifest-fullfilment-filter.json';
import MANIFEST_DETAILS_RESPONSE from '../fixtures/manifest/manifest-detail-response.json';
import MANIFEST_PICKUPSLOT_RESPONSE from '../fixtures/manifest/pickup-slot-response.json';
import ORDER_ROLES from '../fixtures/order-roles.json';
import ACCESS_DETAIl from '../fixtures/access-detail.json';
import MANIFEST_SAVE_PROCESS_RESPONSE from '../fixtures/manifest/manifest-save-process-response.json';
import MANIFEST_SHIPMENT_LISTING from '../fixtures/manifest/manifest-shipment-listing.json';

/*Domanin imports */
import URLS from '@/services/domain.service';

const mock = new MockAdapter(axios);
let wrapper, router, localVue;
describe('GenerateManifestPage', () => {
    beforeEach(async () => {
        localVue = createLocalVue();

        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/manifest', name: 'company-order-manifest', component: ManifestHomePage},
            ],
        });
        router.push(`/company/1/orders/manifest/generate/`);
        // mock.onGet(URLS.FILTERS_APPLICATION_V2()).reply(200, MANIFEST_FILTERS_MOCK);
        mock.onGet(URLS.FILTERS_V2()).reply(200, MANIFEST_FILTERS_MOCK);
        mock.onGet(URLS.GET_FULFILLMENT_CENTER()).reply(200, MANIFEST_FULLFILMENT_FILTER_MOCK);
        mock.onGet(URLS.FETCH_PICKUP_SLOT()).reply(200, MANIFEST_PICKUPSLOT_RESPONSE) // add response as and when getting from kartik
        mock.onGet(URLS.FETCH_MANIFEST_DETAILS()).reply(200, MANIFEST_DETAILS_RESPONSE)
        mock.onPost(URLS.SAVE_PROCESS_MANIFEST(1)).reply(200, MANIFEST_SAVE_PROCESS_RESPONSE)
        // mock.onGet(URLS.SHIPMENT_APPLICATION_V2_LIST()).reply(200, MANIFEST_SHIPMENT_LISTING)
        mock.onGet(URLS.SHIPMENT_V2_LIST()).reply(200, MANIFEST_SHIPMENT_LISTING)
        

        wrapper = mount(GenerateManifestPage, {
            localVue,
            router,
            mocks: {
                $basePath: '/company/1/orders/manifest/generate/',
            },
            computed: {
                orderRoles: ()=> ORDER_ROLES,
                accessDetail: ()=> ACCESS_DETAIl,
                isAnySelected: ()=> true
            },data() {
                return {
                  param: {
                    stores: 3666,
                    dp_ids: 22,
                    group_entity:'shipments',
                    sales_channels: '000000000000000000000001'
                  },
                  paginationConfig: {
                    limit: 10,
                    total: 1,
                    current: 1,
                },
                shipmentList: [
                    {
                        "shipment_id": "16728386520191778204",
                        "shipment_created_time": "2023-01-04T18:54:12+00:00",
                        "order_id": "FY63B57DFB0E59DF5B0F",
                        "invoice_id": "uytr455678o67yh7",
                        "awb": "1751198214585",
                        "items": 1,
                        "isSelected": true
                    },
                    {
                        "shipment_id": "16728328190921053550",
                        "shipment_created_time": "2023-01-04T17:16:59+00:00",
                        "order_id": "FY63B567320E8F12FCEB",
                        "invoice_id": "87ghb",
                        "awb": "9748262218600",
                        "items": 1,
                        "isSelected": true
                    },
                    {
                        "shipment_id": "16723796747001039057",
                        "shipment_created_time": "2022-12-30T11:24:35+00:00",
                        "order_id": "FY63AE7D1A0E5062EEAC",
                        "invoice_id": "4564756757676755",
                        "awb": "9584144093355",
                        "items": 21,
                        "isSelected": true
                    },
                    {
                        "shipment_id": "16727306731141382416",
                        "shipment_created_time": "2023-01-03T12:54:33+00:00",
                        "order_id": "FY63B3D8300E1C001006",
                        "invoice_id": "87yb",
                        "awb": "1857535514805",
                        "items": 21,
                        "isSelected": true
                    },
                    {
                        "shipment_id": "16727482184601635519",
                        "shipment_created_time": "2023-01-03T17:46:58+00:00",
                        "order_id": "FY63B41C9E0EDE59E662",
                        "invoice_id": "jks7sims",
                        "awb": "2133137877953",
                        "items": 21,
                        "isSelected": true
                    },
                    {
                        "shipment_id": "16727498567201314383",
                        "shipment_created_time": "2023-01-03T18:14:17+00:00",
                        "order_id": "FY63B423200E44FE1F99",
                        "invoice_id": "weurywhjbner374",
                        "awb": "5041553994147",
                        "items": 21,
                        "isSelected": true
                    },
                    {
                        "shipment_id": "16727678463621578797",
                        "shipment_created_time": "2023-01-03T23:14:06+00:00",
                        "order_id": "FY63B469650E9F0FEC34",
                        "invoice_id": "345r34t45wfdt546",
                        "awb": "3119556866184",
                        "items": 1,
                        "isSelected": true
                    }
                ]
                };
            },
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Shipment list item renders', async () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });
    it('should not make api call when manifest is generated already, but route to the home page', async () => {
        wrapper.setData({
            manifestGenerated: true,
            totalShipments: MANIFEST_SHIPMENT_LISTING.total_count, 
            shipmentList: MANIFEST_SHIPMENT_LISTING.items,
            isManifestGenerated: true  
        });
        await flushPromises();
        let routerBack = jest.spyOn(router, "push");
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const saveButton = wrapper.findComponent({ ref: 'save-btn' });
        saveButton.trigger('click', 'save');
        await wrapper.vm.$nextTick();
        expect(routerBack).toHaveBeenCalled();
    });

    it('should not make api call when manifest is generated already, and should just open the consent drawer', async () => {
        wrapper.setData({
            manifestGenerated: true,
            totalShipments: MANIFEST_SHIPMENT_LISTING.total_count, 
            shipmentList: MANIFEST_SHIPMENT_LISTING.items,
            isManifestGenerated: true,
            uploadConsentView: false
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const processButton = wrapper.findComponent({ ref: 'process-btn' });
        processButton.trigger('click', 'process');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.uploadConsentView).toBe(true);
    });

    it('should make api call to save the manifest and route back to the home page', async()=>{
        let saveprocessFn = jest.spyOn(wrapper.vm, "processSaveManifest");
        wrapper.setData({
            manifestGenerated: true,
            totalShipments: MANIFEST_SHIPMENT_LISTING.total_count, 
            shipmentList: MANIFEST_SHIPMENT_LISTING.items,
            uploadConsentView: false,
            isManifestGenerated: false,
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        // wrapper.vm.processSaveManifest()
         const saveButton = wrapper.findComponent({ ref: 'save-btn' });
        saveButton.trigger('click', 'save');
        await wrapper.vm.$nextTick();
        expect(saveprocessFn).toHaveBeenCalled();

    });

    it('Hide generic mirage alert which is visible by default on the page', async () => {
        wrapper.setData({
            manifestGenerated: true,
            showAlert: true,
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const btn = wrapper.findComponent({ ref: 'generic-intro' });
        btn.trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.showAlert).toBe(false);
    });

    it('on back click it will route back to the manifest home page', async () => {
        wrapper.setData({
            manifestGenerated: true,
        })
        await flushPromises();
        let routerBack = jest.spyOn(router, "push");
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        let pageHeader = wrapper.findComponent(admpageheader);
        pageHeader.vm.$emit("backClick");
        await wrapper.vm.$nextTick();
        expect(routerBack).toHaveBeenCalled();
    });

    it('should search update the global params on change of the delivery parther', async()=>{
        const dpChangeEvent = wrapper.findComponent({ref: 'delivery-partner-change'})
        dpChangeEvent.vm.$emit('change');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.param.dp_ids).not.toBe('');
    });

    it('should search options in the delivery parthers with text query', async()=> {
        const dpOptionsSearchEvent = wrapper.findComponent({ref: 'delivery-partner-change'})
        dpOptionsSearchEvent.vm.$emit('searchInputChange', {
            "id": "nitrozen-dropdown-3xwil73x",
            "text": "delivery"
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.dpOptions.length).not.toBe(MANIFEST_FILTERS_MOCK.advance[1].length);
    });

    it('should search options in the delivery parthers with blank text query', async()=> {
        const dpOptionsSearchEvent = wrapper.findComponent({ref: 'delivery-partner-change'})
        dpOptionsSearchEvent.vm.$emit('searchInputChange', {
            "id": "nitrozen-dropdown-3xwil73x",
            "text": ""
        })
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.dpOptions.length).toBe(0);
    });

    it('should keep all the rows selected when clicked on this button', async()=>{
        wrapper.setData({
            showSelectAllResponse: true,
            isManifestGenerated: false,
            selectedShipmentCount: 100,
            showCheckboxAlert: true,
            inProgress: false,
            totalShipments: 100


        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
     const selectAllFromResponse = wrapper.findComponent({ref: 'checkbox-intro'});
     selectAllFromResponse.trigger('click');
     await wrapper.vm.$nextTick();
     expect(wrapper.vm.keepRowsAllChecked).toBe(true);
    });

    it('calling debounce function to select all and it should set the keepAllRow flag to false', async()=>{
        wrapper.setData({
            keepRowsAllChecked: true,
        })
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        wrapper.vm.selectUnSelectAllItem();
        await new Promise(resolve => setTimeout(resolve, 150));   
        expect(wrapper.vm.keepRowsAllChecked).toBe(false);
 
    });

    it('calling debounc function to select one row at a time', async()=>{
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        wrapper.vm.selectItem(1);
        await new Promise(resolve => setTimeout(resolve, 150)); 
         expect(wrapper.vm.disableManifestGeneration).toBe(false);

    });

    it('should close upload consent view', async()=>{
        wrapper.setData({
            uploadConsentView: true
        });
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        const closeEventn = wrapper.findComponent({ref:'slide-fade-upload-consent'});
        closeEventn.trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.uploadConsentView).toBe(false);

    });
});
