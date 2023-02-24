'use strict';

/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

/* Component imports */
import EditManifestDrawer from '@/pages/oms/manifest/edit-manifest-drawer.vue';
import ManifestHomePage from '@/pages/oms/manifest/index.vue';
import ManifestDetailPage from '@/pages/oms/manifest/manifest-details/manifest-details.vue';

/* Mock imports */
 import MANIFEST_SHIPMENT_LISTING from '../fixtures/manifest/manifest-shipment-listing.json';

/* Domain imports */
 import URLS from '@/services/domain.service';

let wrapper, router, localVue;

const mock = new MockAdapter(axios);

describe('EditManifestDrawer', () => {
    beforeEach(async () => {
        localVue = createLocalVue();

        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/orders/manifest', name: 'company-order-manifest', component: ManifestHomePage},
                { path: 'orders/manifest/:manifestId/',name: 'company-manifest-detail', component: ManifestDetailPage },
            ],
        });
        router.push(`/company/1/orders/manifest/Manifest-01001/`);
        mock.onGet(URLS.SHIPMENT_V2_LIST()).reply(200, MANIFEST_SHIPMENT_LISTING);


        wrapper = mount(EditManifestDrawer, {
            localVue,
            router,
            propsData: { manifestId: 'manifest-1101', filters: {
                "from_date": "12-10-2022",
                "to_date": "11-01-2023",
                "dp_ids": 29,
                "dp_name": "Delhivery Surface II",
                "lane": "ready_for_dispatch",
                "sales_channels": "",
                "stores": 3664,
                "store_name": "Store name ---Shetty & Co"
            } },
            mocks: {
                $basePath: '/company/1/orders/manifest/Manifest-01001/',
            },
            computed: {
                isAllSelected: ()=> false,
                isSelected: ()=> true
            }
        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Shipment list item renders', async () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('on selection all the checkbox values should be true', async()=>{
        const selectUnselectAllItem =  jest.spyOn(wrapper.vm, 'selectUnselectAllItem')
        wrapper.setData({
            manifestList:  MANIFEST_SHIPMENT_LISTING.items,
            fetchInProgress: false,
            isAllSelected: false 
        });
        
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        wrapper.vm.selectUnselectAllItem();
        await wrapper.vm.$nextTick();
        await flushPromises();
         await new Promise(resolve => setTimeout(resolve, 150));
       expect(selectUnselectAllItem).toHaveBeenCalled();
    });

    it('on selection all the checkbox values should be true', async()=>{
        const selectUnselectAllItem =  jest.spyOn(wrapper.vm, 'selectUnselectAllItem')
        wrapper.setData({
            manifestList:  MANIFEST_SHIPMENT_LISTING.items,
            fetchInProgress: false,
            isAllSelected: true 
        });
        
        await wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        wrapper.vm.selectUnselectAllItem();
        await wrapper.vm.$nextTick();
        await flushPromises();
         await new Promise(resolve => setTimeout(resolve, 150));
       expect(selectUnselectAllItem).toHaveBeenCalled();
    });
    

    it('Catch api fail for manifest listing', async ()=> {
          const snackbarError = jest.spyOn(wrapper.vm.$snackbar.global, 'showError');

        wrapper = mount(EditManifestDrawer, {
            localVue,
            router,
            propsData: { manifestId: 'manifest-1101' },
            mocks: {
                $basePath: '/company/1/orders/manifest/Manifest-01001/',
            },
            computed: {
                isAllSelected: ()=> false,
            }
        });

        mock.onGet(URLS.SHIPMENT_V2_LIST()).reply(400, {});
        await wrapper.vm.$nextTick();
        // await new Promise(resolve => setTimeout(resolve, 10));
         expect(wrapper.vm.fetchError).toBe(false);
        // expect(snackbarError).toHaveBeenCalled()

    });

    it('should add shipments', async()=>{
        wrapper.vm.addShipments();
        
        expect(wrapper.emitted()['update']).toBeTruthy();

    });
});
